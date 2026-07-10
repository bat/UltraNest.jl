# This file is a part of UltraNest.jl, licensed under the MIT License (MIT).

import Test

Test.@testset "Package UltraNest" begin
    include("test_aqua.jl")
    include("test_ultra_nest.jl")
    include("test_docs.jl")
end # testset
