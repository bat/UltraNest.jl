# This file is a part of UltraNest.jl, licensed under the MIT License (MIT).

"""
    UltraNest

Julia wrapper for Python nested sampling package
[UltraNest](https://github.com/JohannesBuchner/UltraNest).
"""
module UltraNest

using PythonCall

"""
    const ultranest

The Python `ultranest` module.

Example:

```julia
using UltraNest
smplr = ultranest.ReactiveNestedSampler(paramnames, my_likelihood, kwargs...)
result = smplr.run()
```

See the
[UltraNest Python documentation](https://johannesbuchner.github.io/UltraNest/)
regarding usage.

!!! note

    Convention for matrices holding multiple parameter vectors (resp.
    multiple samples): In UltraNest.jl, using Julia's column-major array
    indexing, parameter vectors are stored as rows (not columns) in the
    matrices.

!!! note

    Python code must not be run on multiple Julia threads simultaneously.
    Either interact with `ultranest` only from a single Julia thread, or
    use the locking mechanisms provided by the `PythonCall.GIL` module.
"""
const ultranest = PythonCall.pynew()
export ultranest

function __init__()
    PythonCall.pycopy!(ultranest, pyimport("ultranest"))
    return nothing
end

end # module
