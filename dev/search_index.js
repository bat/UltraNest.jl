var documenterSearchIndex = {"docs":
[{"location":"api/#API-1","page":"API","title":"API","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"DocTestSetup  = quote\n    using UltraNest\nend","category":"page"},{"location":"api/#Modules-1","page":"API","title":"Modules","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"Order = [:module]","category":"page"},{"location":"api/#Types-and-constants-1","page":"API","title":"Types and constants","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"Order = [:type, :constant]","category":"page"},{"location":"api/#Functions-and-macros-1","page":"API","title":"Functions and macros","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"Order = [:macro, :function]","category":"page"},{"location":"api/#Documentation-1","page":"API","title":"Documentation","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"Modules = [UltraNest]\nOrder = [:module, :type, :constant, :macro, :function]","category":"page"},{"location":"api/#UltraNest.UltraNest","page":"API","title":"UltraNest.UltraNest","text":"UltraNest\n\nJulia wrapper for Python nested sampling package UltraNest.\n\n\n\n\n\n","category":"module"},{"location":"api/#UltraNest.ultranest","page":"API","title":"UltraNest.ultranest","text":"const ultranest\n\nThe Python ultranest module.\n\nExample:\n\nusing UltraNest\nsmplr = ultranest.ReactiveNestedSampler(paramnames, my_likelihood, kwargs...)\nresult = smplr.run()\n\nSee the the UltraNest Python documentation regarding usage.\n\n!!! note\n\nConvention for matrices holding multiple parameter vectors (resp.\nmultiple samples): In UltraNest.jl, using Julia's column-major array\nindexing, parameter vectors are stored as rows (not columns) in the\nmatrices.\n\n\n\n\n\n","category":"constant"},{"location":"LICENSE/#LICENSE-1","page":"LICENSE","title":"LICENSE","text":"","category":"section"},{"location":"LICENSE/#","page":"LICENSE","title":"LICENSE","text":"using Markdown\nMarkdown.parse_file(joinpath(@__DIR__, \"..\", \"..\", \"LICENSE.md\"))","category":"page"},{"location":"#UltraNest.jl-1","page":"Home","title":"UltraNest.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"This is a Julia wrapper for Python nested sampling package UltraNest.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Nested sampling allows Bayesian inference on arbitrary user-defined likelihoods. In particular, posterior probability distributions on model parameters are constructed, and the marginal likelihood (\"evidence\") Z is computed. The former can be used to describe the parameter constraints of the data, the latter can be used for model comparison (via Bayes factors) as a measure of the prediction parsimony of a model.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"UltraNest provides novel, advanced techniques (see how it works). They are especially remarkable for being free of tuning parameters and theoretically justified. Beyond that, UltraNest has support for Big Data sets and high-performance computing applications.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"This Julia package is currently just a very thin wrapper around the Python ultranest package, which it will (if not already present) try to automatically install via Conda.jl.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"In the future, some Julianic wrapper functions may be added for ultranests main functionalities, but UltraNest.jl is primarily intended to be a lower-level package that can act as a sampling backend for high-level packages.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Currently UltraNest.jl exports a single global constant ultranest. PyCall.jl's magic makes using ultranest from Julia very similar to the equivalent Python code.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Python:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"import ultranest\n# ... define log-likelihood and prior_transform ...\nparamnames = [\"a\", \"b\", \"c\"]\nsmplr = ultranest.ReactiveNestedSampler(paramnames, loglikelihood, transform = prior_transform, vectorized = True)\nresult = smplr.run(min_num_live_points = 400, cluster_num_live_points = 40)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Julia:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using UltraNest\n# ... define log-likelihood and prior_transform ...\nparamnames = [\"a\", \"b\", \"c\"]\nsmplr = ultranest.ReactiveNestedSampler(paramnames, loglikelihood, transform = prior_transform, vectorized = true)\nresult = smplr.run(min_num_live_points = 4000, cluster_num_live_points = 400)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"See the the UltraNest Python documentation regarding usage.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"note: Note\nConvention for matrices holding multiple parameter vectors (resp. multiple samples): In UltraNest.jl, using Julia's column-major array indexing, parameter vectors are stored as rows (not columns) in the matrices.","category":"page"},{"location":"#Usage-example-1","page":"Home","title":"Usage example","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"As an example, we'll sample a multi-modal distribution that is tricky to handle using other methods like MCMC.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"In addition to UltraNest.jl, we'll be using the Julia packages Distributions.jl, Plots.jl and Measurements.jl, so they need to be added to your current Julia environment to run this example.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Let's define a multi-modal distribution with fully separated modes that will act as our likelihood:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using Distributions\n\ndist = product_distribution([\n    MixtureModel([truncated(Normal(-1, 0.1), -2, 0), truncated(Normal(1, 0.1), 0, 2)], [0.5, 0.5]),\n    MixtureModel([truncated(Normal(-2, 0.25), -3, -1), truncated(Normal(2, 0.25), 1, 3)], [0.3, 0.7]),\n    MixtureModel([truncated(Normal(-5, 0.25), -6, -4), truncated(Normal(5, 0.25), 4, 6)], [0.2, 0.8]),\n])\nnothing #hide","category":"page"},{"location":"#","page":"Home","title":"Home","text":"To use UltraNest, we need to define express the prior of our model as a transformation from the unit hypercube to the model parameters. Here we will simply use a flat prior over the support dist:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"prior_transform = let dist=dist\n    (u::AbstractVector{<:Real}) -> begin\n        x0 = minimum.(dist.v)\n        Δx = maximum.(dist.v) .- x0 \n        u .* Δx .+ x0\n    end\nend\nnothing #hide","category":"page"},{"location":"#","page":"Home","title":"Home","text":"UltraNest supports vectorized operation, passing multiple parameter vectors to the transformation as a matrix. We need to take into account that in UltraNest.jl, parameters are stored as rows in the matrix:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"prior_transform_vectorized = let trafo = prior_transform\n    (U::AbstractMatrix{<:Real}) -> reduce(vcat, (u -> trafo(u)').(eachrow(U)))\nend\nnothing #hide","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Our log-likelihood will simply be the log-PDF of dist for a given set up parameters:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"loglikelihood = let dist = dist\n    function (x::AbstractVector{<:Real})\n        ll = logpdf(dist, x)\n        # lofpdf on MixtureModel returns NaN in gaps between distributions, and UltraNest\n        # doesn't like -Inf, so return -1E10:\n        T = promote_type(Float32, typeof(ll))\n        isnan(ll) ? T(-1E10) : T(ll)\n    end\nend\nnothing #hide","category":"page"},{"location":"#","page":"Home","title":"Home","text":"To use UltraNest's vectorized mode, we need a vectorized version of the likelihood as well:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"loglikelihood_vectorized = let loglikelihood = loglikelihood\n    # UltraNest has variate in rows:\n    (X::AbstractMatrix{<:Real}) -> loglikelihood.(eachrow(X))\nend\nnothing #hide","category":"page"},{"location":"#","page":"Home","title":"Home","text":"For computationally expensive likelihood functions, it will often be beneficial to parallelize this using Julia's multi-threaded and distributed computing capabilities. Note that the Python UltraNest package comes with MPI support as well - it should also be possible to use this for distributed parallelization, in combination with Julia's muli-threading for host-level parallelization.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Now we're ready to sample our posterior. We'll use UltraNest's ReactiveNestedSampler:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using UltraNest\n\nparamnames = [\"a\", \"b\", \"c\"]\nsmplr = ultranest.ReactiveNestedSampler(paramnames, loglikelihood_vectorized, transform = prior_transform_vectorized, vectorized = true)\nresult = smplr.run(min_num_live_points = 4000, cluster_num_live_points = 400)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"result is a Dict that contains the samples (in weighted and unweighted form), the logarithm of the posterior's integral and additional valuable information. Since our prior was flat, we can compare the samples generated by UltraNest with truly random (IID) samples drawn from dist:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"X_ultranest = result[\"samples\"]\n\nX_iid = Array(rand(dist, 10^4)')\n\nusing Plots\nPlots.gr(size = (1024, 768), format = \"png\") # hide\n\nfunction plot_marginal(d::NTuple{2,Integer})\n    if d[1] == d[2]\n        plt = stephist(X_iid[:,d[1]].+0.01, nbins = 200, normalize = true, label = \"IID sampling\", xlabel = paramnames[d[1]])\n        stephist!(plt, X_ultranest[:,d[1]], nbins = 200, normalize = true, label = \"UltraNest\")\n        plt\n    else\n        histogram2d(\n            X_ultranest[:,d[1]], X_ultranest[:,d[2]],\n            nbins = 200, xlabel = paramnames[d[1]], ylabel = paramnames[d[2]], legend = :none\n        )\n    end\nend\n\nplot(\n    plot_marginal.([(i, j) for i in 1:3, j in 1:3])...,\n)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"The log-integral of the posterior computed by UltraNest is","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using Measurements\n\nlogz = result[\"logz\"]\nlogzerr = result[\"logzerr\"]\nlogz ± logzerr","category":"page"},{"location":"#","page":"Home","title":"Home","text":"which matches our expectation based on the volume of our flat prior:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"logz_expected = -log(prod(maximum.(dist.v) .- minimum.(dist.v)))","category":"page"},{"location":"#","page":"Home","title":"Home","text":"In addition to processing UltraNest's output with Julia directly, you can also let ultranest.ReactiveNestedSampler create on-disk output via keyword argument log_dir = \"somepath/\".","category":"page"}]
}