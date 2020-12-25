# UltraNest.jl

This is a Julia wrapper for Python nested sampling package
[UltraNest](https://github.com/JohannesBuchner/UltraNest).

Nested sampling allows Bayesian inference on arbitrary user-defined likelihoods. In particular, posterior probability distributions on model parameters are constructed, and the marginal likelihood ("evidence") Z is computed. The former can be used to describe the parameter constraints of the data, the latter can be used for model comparison (via *Bayes factors*) as a measure of the prediction parsimony of a model.

UltraNest provides novel, advanced techniques (see [how it works](https://johannesbuchner.github.io/UltraNest/method.html)). They are especially remarkable for being free of tuning parameters and theoretically justified. Beyond that, UltraNest has support for Big Data sets and high-performance computing applications.

This Julia package is currently just a very thin wrapper around the Python ultranest package, which it will (if not already present) try to automatically install via [Conda.jl](https://github.com/JuliaPy/Conda.jl).

In the future, some Julianic wrapper functions may be added for ultranests main functionalities, but UltraNest.jl is primarily intended to be a lower-level package that can act as a sampling backend for high-level packages.

Currently UltraNest.jl exports a single global constant `ultranest`. [PyCall.jl](https://github.com/JuliaPy/PyCall.jl)'s magic makes using ultranest from Julia very similar to the equivalent Python code.

Python:

```python
import ultranest
# ... define log-likelihood and prior_transform ...
paramnames = ["a", "b", "c"]
smplr = ultranest.ReactiveNestedSampler(paramnames, loglikelihood, transform = prior_transform, vectorized = True)
result = smplr.run(min_num_live_points = 400, cluster_num_live_points = 40)
```

Julia:

```julia
using UltraNest
# ... define log-likelihood and prior_transform ...
paramnames = ["a", "b", "c"]
smplr = ultranest.ReactiveNestedSampler(paramnames, loglikelihood, transform = prior_transform, vectorized = true)
result = smplr.run(min_num_live_points = 4000, cluster_num_live_points = 400)
```

See the the [UltraNest Python documentation](https://johannesbuchner.github.io/UltraNest/) regarding usage.

!!! note

    Convention for matrices holding multiple parameter vectors (resp. multiple samples): In UltraNest.jl, using Julia's column-major array indexing, parameter vectors are stored as rows (not columns) in the matrices.


## Usage example

As an example, we'll sample a multi-modal distribution that is tricky to handle using other methods like MCMC.

In addition to UltraNest.jl, we'll be using the Julia packages [Distributions.jl](https://github.com/JuliaStats/Distributions.jl), [Plots.jl](https://github.com/JuliaPlots/Plots.jl) and [Measurements.jl](https://github.com/JuliaPhysics/Measurements.jl), so they need to be [added to your current Julia environment](https://docs.julialang.org/en/v1/stdlib/Pkg) to run this example.

Let's define a multi-modal distribution with fully separated modes that will act as our likelihood:

```@example using_ultranest
using Distributions

dist = product_distribution([
    MixtureModel([truncated(Normal(-1, 0.1), -2, 0), truncated(Normal(1, 0.1), 0, 2)], [0.5, 0.5]),
    MixtureModel([truncated(Normal(-2, 0.25), -3, -1), truncated(Normal(2, 0.25), 1, 3)], [0.3, 0.7]),
    MixtureModel([truncated(Normal(-5, 0.25), -6, -4), truncated(Normal(5, 0.25), 4, 6)], [0.2, 0.8]),
])
nothing #hide
```

To use UltraNest, we need to define express the prior of our model as a transformation from the unit hypercube to the model parameters. Here we will simply use a flat prior over the support `dist`:

```@example using_ultranest
prior_transform = let dist=dist
    (u::AbstractVector{<:Real}) -> begin
        x0 = minimum.(dist.v)
        Δx = maximum.(dist.v) .- x0 
        u .* Δx .+ x0
    end
end
nothing #hide
```

UltraNest supports vectorized operation, passing multiple parameter vectors to the transformation as a matrix. We need to take into account that in UltraNest.jl, parameters are stored as rows in the matrix:

```@example using_ultranest
prior_transform_vectorized = let trafo = prior_transform
    (U::AbstractMatrix{<:Real}) -> reduce(vcat, (u -> trafo(u)').(eachrow(U)))
end
nothing #hide
```


Our log-likelihood will simply be the log-PDF of `dist` for a given set up parameters:

```@example using_ultranest
loglikelihood = let dist = dist
    function (x::AbstractVector{<:Real})
        ll = logpdf(dist, x)
        # lofpdf on MixtureModel returns NaN in gaps between distributions, and UltraNest
        # doesn't like -Inf, so return -1E10:
        T = promote_type(Float32, typeof(ll))
        isnan(ll) ? T(-1E10) : T(ll)
    end
end
nothing #hide
```

To use UltraNest's vectorized mode, we need a vectorized version of the likelihood as well:

```@example using_ultranest
loglikelihood_vectorized = let loglikelihood = loglikelihood
    # UltraNest has variate in rows:
    (X::AbstractMatrix{<:Real}) -> loglikelihood.(eachrow(X))
end
nothing #hide
```

For computationally expensive likelihood functions, it will often be beneficial to parallelize this using [Julia's multi-threaded and distributed computing capabilities](https://docs.julialang.org/en/v1/manual/parallel-computing/).

Now we're ready to sample our posterior:

```@example using_ultranest
using UltraNest

paramnames = ["a", "b", "c"]
smplr = ultranest.ReactiveNestedSampler(paramnames, loglikelihood_vectorized, transform = prior_transform_vectorized, vectorized = true)
result = smplr.run(min_num_live_points = 4000, cluster_num_live_points = 400)
```

`result` is a `Dict` that contains the samples (in weighted and unweighted form), the logarithm of the posterior's integral and additional valuable information. Since our prior was flat, we can compare the samples generated by UltraNest with truly random (IID) samples drawn from `dist`:

```@example using_ultranest
X_ultranest = result["samples"]

X_iid = Array(rand(dist, 10^4)')

using Plots
Plots.gr(size = (1024, 768), format = "png") # hide

function plot_marginal(d::NTuple{2,Integer})
    if d[1] == d[2]
        plt = stephist(X_iid[:,d[1]].+0.01, nbins = 200, normalize = true, label = "IID sampling", xlabel = paramnames[d[1]])
        stephist!(plt, X_ultranest[:,d[1]], nbins = 200, normalize = true, label = "UltraNest")
        plt
    else
        histogram2d(
            X_ultranest[:,d[1]], X_ultranest[:,d[2]],
            nbins = 200, xlabel = paramnames[d[1]], ylabel = paramnames[d[2]], legend = :none
        )
    end
end

plot(
    plot_marginal.([(i, j) for i in 1:3, j in 1:3])...,
)
```

The log-integral of the posterior computed by UltraNest is

```@example using_ultranest
using Measurements

logz = result["logz"]
logzerr = result["logzerr"]
logz ± logzerr
```

which matches our expectation based on the volume of our flat prior:

```@example using_ultranest
logz_expected = -log(prod(maximum.(dist.v) .- minimum.(dist.v)))
```
