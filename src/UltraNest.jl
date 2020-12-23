# This file is a part of UltraNest.jl, licensed under the MIT License (MIT).

__precompile__(true)

"""
    UltraNest

Julia wrapper for Python nested sampling package
[UltraNest](https://github.com/JohannesBuchner/UltraNest).
"""
module UltraNest

using LinearAlgebra
using Random
using Statistics

using PyCall


"""
    const ultranest

The Python `ultranest` module.

Example:

```julia
using UltraNest
smplr = ultranest.ReactiveNestedSampler(paramnames, my_likelihood, kwargs...)
result = smplr.run()
```

See the the
[UltraNest Python documentation](https://johannesbuchner.github.io/UltraNest/)
regarding usage.

    !!! note

    Convention for matrices holding multiple parameter vectors (resp.
    multiple samples): In UltraNest.jl, using Julia's column-major array
    indexing, parameter vectors are stored as rows (not columns) in the
    matrices.
"""
const ultranest = PyNULL()
export ultranest


const scipy_stats = PyNULL()
const numpy = PyNULL()


include("ultra_nest.jl")

function __init__()
    copy!(ultranest, pyimport_conda("ultranest", "ultranest", "conda-forge"))
    copy!(scipy_stats, pyimport_conda("scipy.stats", "scipy"))
    copy!(numpy, pyimport("numpy"))    
end

end # module
