The UltraNest.jl package is licensed under the MIT "Expat" License:

> Copyright (c) 2020:
>
>    Johannes Buchner <johannes.buchner.acad@gmx.com>,
>    Oliver Schulz <oschulz@mpp.mpg.de>
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
> 

Licence guidance

This explanation does not affect or replace the terms of the license.

UltraNest.jl is a Julia wrapper for the Python ultranest package, which
itself is licensed under the GNU General Public License (GPL).
UltraNest.jl itself contains no ultranest code in any form, and so does
not constitute a derived work by itself. If UltraNest.jl is distributed
together with the ultranest Python package, the terms of the GPL need to
be taken into consideration. This means: In the very likely case that
your software uses UltraNest.jl as only one of several potential
inference modules, your software does not need to be GPL licensed, but
you will need to either redistribute the source code of ultranest or
point to it. If your software is deeply integrated with ultranest and
you want to redistribute the complete package under an MIT or
proprietary license, you can obtain a suitable license by contacting
Johannes Buchner <johannes.buchner.acad@gmx.com>.
