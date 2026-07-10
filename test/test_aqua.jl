# This file is a part of UltraNest.jl, licensed under the MIT License (MIT).

import Test
import Aqua
import UltraNest

Test.@testset "Package ambiguities" begin
    Test.@test isempty(Test.detect_ambiguities(UltraNest))
end # testset

Test.@testset "Aqua tests" begin
    Aqua.test_all(
        UltraNest,
        ambiguities = true
    )
end # testset
