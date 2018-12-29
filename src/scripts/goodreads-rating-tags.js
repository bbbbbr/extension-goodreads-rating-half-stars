// ==UserScript==
// @name        Goodreads Half-Stars and Rating Tags
// @namespace   http://www.goodreads.com/*
// @description Converts selected tags on GoodReads into rating images (such as tags with half-star ratings)
// @include     http://*.goodreads.com/*
// @include     http://goodreads.com/*
// @include     https://*.goodreads.com/*
// @include     https://goodreads.com/*
// @grant       none
// @version     1.0.6
// @updateURL   https://openuserjs.org/install/bbbbbr/Goodreads_Half-Stars_and_Rating_Tags.user.js
// @downloadURL https://openuserjs.org/install/bbbbbr/Goodreads_Half-Stars_and_Rating_Tags.user.js
// @homepageURL https://openuserjs.org/scripts/bbbbbr/Goodreads_Half-Stars_and_Rating_Tags
// @license     GPL-2.0-or-later
// ==/UserScript==

// TODO : Consider narrowing scope of anchor node scan and use query selector instead

// Some examples of the tag naming format that will get matched :
// (The range is 0-0 to 5-0)
//
//   clouds-3-0
//   stars-0-5
//   rating-clouds-3-0
//   rating-stars-0-5
//   example-clouds-2-0
//   example-stars-0-5
//   another-example-clouds-3-0
//   another-example-stars-0-5



//
// Load tag image data into keyed hash
//
function initImageData()
{
    // Readinglist style stars
    tagImages['stars-on'  ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAArlBMVEUAAACZhA2SfAeTfQiWgAqjjhSbhhCZhA6VfwmTfQiSfAe/qiG8pBq+qCG1oyOXgQyqlx2ZhA2ahQ6Ygg2SfAeSfAfFrh/DsS+ahg+1pCuznhuwmxqXggyahQ+ahQ+bhhCahQ+WgAuSfAeSfAeSfAeSfAeSfAeSfAf93SD92xz83yv82yDz0x741Rf95Dnawyvz0Bbw3UTo1D3izz333TPgyC/y1ijjySb21yH62BsxGQzCAAAAKHRSTlMA9Rr9+PDNpoqECvr49/Pw7+axmjkW/vvz8vLx7tXFwruRXEdELyACk7+DAAAAAJFJREFUCNdtj1cOgzAQRE0zjuktvVdXID25/8ViAkRBYn92nrR62gH9Yw86eDIWHd764+M/LwsHtVnX9dQUz+iggsK5pmmWWwrXUgECgMzLQ5RScpaPguo+i5yXfFPC/BX+CnA8pJSSadIa1wUhnHu/l4z8NvPYHTa4D68msq2zgWtOJjADIA3CXdNlU++4EnwAIugKeWWWGPcAAAAASUVORK5CYII=" };
    tagImages['stars-half']  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAtFBMVEUAAACwsLCwsLCwsLCWgAqZhA2wsLCwsLCSfAeTfAe1oyewsLCwsLCwsLCwsLCZgw2wsLCVfwmwsLCwsLCSfAewsLDFrh+/qiK9pBiwsLCwmxqplhykjxSXggyYgw2wsLCbhhCahQ+ahQ+ahQ+ZhA6wsLCWgAuwsLCSfAeSfAeSfAewsLCwsLCwsLCSfAf93B754DXy0h/10hbo1D3izz3bxC3YwSry1ij21yH62Bv41hjyzxbr3p9MAAAAL3RSTlMA5pMa+PWjgxr98tTHvLaeiYlFJBYG/vr6+PHv7+7n4M/Fu7Spm5GMXEQ7OC8NCqlfTewAAACKSURBVAjXbcxVDsMwEEXRZzt2HGywzMyBcrv/fVVWHKmRej9m5vwM/rc0m7bcBrf2JP717L4J6ltKuTeK2DkyxgCMOOfD7gfUIYR4QGhcHkVZAkBA1EzGnef7BaTCP0F1XrSzDBAUuvlNmZq1rTzvU0Se5m5wNcKVy3pp5ZY9TYAD8SPtdbWFevAFqBcJHezWuyEAAAAASUVORK5CYII=" };
    tagImages['stars-off' ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAVFBMVEUAAACwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLDhRk/qAAAAHHRSTlMA5hqTo4yIg/rvxry2m0MlDQbd1K2nV0g5Fr8vhYZdwQAAAHRJREFUCNdtjkkShCAMRT8EUBAUnO2+/z07QGtplX+RvLfIgPeE5umte+iqxuHuftPmZCnlbjFMXwZWwXEaoImhA4y9Jo3I9Rh1saR8LBCXcnwh/DOvuVJzPZPiTOi7agy9NcHJNlUn9TmAXfitetC1q7zgB1YDA4NW818dAAAAAElFTkSuQmCC" };
    tagImages['stars-025' ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAEZ0FNQQAAsY58+1GTAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAGRSURBVHjanJIxaBNhFMd/d6Z3l2qiJibQCCXikCpkEUGHgCJCp/KQgkhBcO2QdHUJGTJlDkIXFRWEQhGeBCQiglsGQUuhoVwRDaiQUCFYJQnidbnIGZPBfPCG733v970///cMz/OY9piTHlT1gaqW/xtWVRO4A1ybpvMK8BQ4rarpaeFNYHUSbHieR7XopAK5M/MXN2oiclJVzwHPgFtAZ1ggIl8AzPVy5Jvt2K7tWK5tW24sHqkB9/2iJvAaeAy8HYaqvgIw7pXCFdM0CzeWLzizZgd+/SCSbRkTjKwAt0UkFZSdtGxrK5NJxC9lvZnwwgdjBAr5amLAioh8/2NYvtxrD/qDs667//Jd8/e4rXkCdEVkaQj+5Xa+3PsJ2MlkdJzkDtAdTYaCl36vfzU9fxRVPeHL/CwiBeA5cHfinKtF53py7tTB1/0ZgBawC4RVtQHsADlVdcZ2tizr5rHo8SP1F9vvE+dZFJG2b9Zlf0RvgCtA/R/YMA3n097Hh6ulg7Xg7yLSAFKq+gjIBeHDAQAuvYZ20i041wAAAABJRU5ErkJggg==" };
    tagImages['stars-075' ]  = { imgData: "data:image/png;base64,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" };

    // Readinglist style clouds
    tagImages['clouds-on'  ] = { imgData: "data:image/gif;base64,R0lGODlhDwAPAMQAAP///9XV1bi4uJ6enp2dnZycnJqampmZmZSUlJKSko6OjoiIiIaGhoSEhIODg4KCgoGBgYCAgHFxcXBwcG5ubm1tbWxsbGpqamlpaf///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAPAA8AAAVHYCaOZEkOjDgMprq+AyKZBLwWjmnDy7jbhonrt2JgRBDF4aB4NBKFBIQiHFUul8pkYsFYZq0wKTIWkcuj89m0FmfabXFcFAIAOw==" };
    tagImages['clouds-half'] = { imgData: "data:image/gif;base64,R0lGODlhDwAPAMQAAP///9XV1bi4uJ6enp2dnZycnJqampmZmZSUlJKSko6OjoiIiIaGhoSEhIODg4KCgoGBgYCAgHFxcXBwcG5ubm1tbWxsbGpqamlpaf///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAPAA8AAAVEYCaOZEkOjCgIpji8bxCsJgEPQM6WN57Po94r99sJfcQdRHE4KB4NIgA4qlwulclq2+qWIqTdbgQmq7plryidGavZoxAAOw==" };
    tagImages['clouds-off' ] = { imgData: "data:image/gif;base64,R0lGODlhDwAPAMQAAP///9XV1bi4uJ6enp2dnZycnJqampmZmZSUlJKSko6OjoiIiIaGhoSEhIODg4KCgoGBgYCAgHFxcXBwcG5ubm1tbWxsbGpqamlpaf///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAPAA8AAAU0YCaOZEkKgoiaahCg7loKQG0D6Xzb7wjvvBwNeBMKAkRAz4dqOlnQ2Ukl9VFZueh1q82SQgA7" };
    tagImages['clouds-025' ] = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAxElEQVR42qxSwQ2DMAw8I36IEbKAF2CE/BiFGWCSrBEvwgLMga6voJAGaKtasmRb8Z19sZDEr9aUhRACzexANLNTnpvkzCEEAsAwDNi2DQDgnAOAI/feS3rf5kgkISJQVajqiUVVYWbXY4vI7Y7OOeQrtPm4T5amMTN676X5VuF8nTaJ0fc9uq57bF7Xta72NE3c9x3jON4CJMXlb0eyLMsbUnkwKP+WJOZ5ZoqTxxhZi5OjLNRArvyxscZ4yfxpI0m8BgCv0/wrDQUF8QAAAABJRU5ErkJggg==" };
    tagImages['clouds-075' ] = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAzUlEQVR42qSSwY2EMAxFX5I9gaAAJBqgEV+ohRrgRBmpI43QAC3ADeQ9DYqGTNDsWooUO/n/2z8xqspfw74XvPc6z7PGufc+qWBi5U+XAJqmAUBETFI5N4KI5Ns2xmRnbNuWEMKl8PPUbhxd1wEQQlARMfZbh18El/K6rlRVRVmWAOz7zrZtWGup65qiKC7Asixpt4dh0PM8AXDO4ZwD4DgO+r6PzTM38L8+yTRNN6a4Fjt9va2qMo6jvvapWuqcHOBpPQJzZFnmpy5+BwCue/flrgcbEwAAAABJRU5ErkJggg==" };
}


//
// Installs a mutation observer callback for nodes matching the given css selector
//
function registerMutationObserver(selectorCriteria, monitorSubtree, callbackFunction)
{
    // Cross browser mutation observer support
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    // Find the requested DOM nodes
    var targetNodeList = document.querySelectorAll(selectorCriteria);


    // Make sure the required elements were found, otherwise don't install the observer
    if ((targetNodeList != null) && (MutationObserver != null)) {

        // Create an observer and callback
        var observer = new MutationObserver( callbackFunction );

        // Start observing the target element(s)
        //   Note : Repeated observe calls on the same target just replace the previous observe, so it's
        //          ok to re-observe the same target in the future without first disconnecting from it
        for(var i = 0; i < targetNodeList.length; ++i) {

            observer.observe(targetNodeList[i], {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: monitorSubtree
            });
        }
    }
}


//
// Monitors and converts dynamic content updates to tag shelfs (such as when a user edits tags via a pop-up)
// * Called on page load and by other dynamic content hooks (to capture new tag shelfs that get added after page load)
//
function installTagShelfUpdateHook()
{
    // Matches/watches the various types of tag shelfs (on the book list page, review edit page, book page, etc)
    // Subtree monitoring enabled to catch updates to the shelvesSection div where the entire shelfList div is replaced
    registerMutationObserver('[id*=shelfList],[id*=shelvesSection]', true,
        function(mutations) { convertTagsToImages(); }
    );
}


//
// Handles converting the in-page popup review editor (launched from book list pages)
//
function installPopupReviewHook()
{
    registerMutationObserver('[id=boxContents]', false,
        function(mutations) { convertTagsToImages(); installTagShelfUpdateHook(); }
    );
}


//
// Handles content updates generated by Infinite Scroll mode on book list pages
//
function installInfiniteScrollHook()
{
    // Subtree monitoring enabled in order to catch the text content changes in the infiniteStatus div
    registerMutationObserver('[id=infiniteStatus]', true,
        function(mutations) { convertTagsToImages(); installTagShelfUpdateHook(); }
    );
}

//
// Monitors for tags getting in-place renamed on the edit shelves page
//
function installEditShelfHook()
{
    registerMutationObserver('[class=displayShelfNameLnk]', false,
        function(mutations) {

            mutations.forEach( function(mutation) {

                // Only inspect nodes which have an 'inspected' flag to remove
                if (mutation.target.hasAttribute("data-tag-image-inspected") == true)
                {
                    // If a rename detection sub-tag was not found then it was probably removed by a rename event
                    // and this node needs to have it's 'inspected' flag cleared so it gets re-examined
                    if (mutation.target.querySelector('[class=tagRenameCanary]') == null) {
                            delete mutation.target.dataset.tagImageInspected;
                    }
                }
            } );

            convertTagsToImages();
        } ); // End observer callback function
}


//
// Attempt to match and support a variety of rating tag formats created by other users
//
// ---------------------------------------
// Some rating tag specimens from the wild
//
//   Whole star rating
//      four-stars
//      actual-rating-4-stars
//
//   Half star ratings
//      four-and-one-half
//      four-and-a-half-star
//      4-half-star
//      3-and-a-half-stars
//      four-ana-half-stars
//      actual-rating-4-half-star
//
function rewiteAlternateRatingFormats(tagName)
{
    // Require plural version of rating keywords
    tagName = tagName.replace(/stars?/gi,  "stars");
    tagName = tagName.replace(/clouds?/gi,  "clouds");

    // Convert string numerics to digits
    tagName = tagName.replace(/five/gi,  "5");
    tagName = tagName.replace(/four/gi,  "4");
    tagName = tagName.replace(/three/gi, "3");
    tagName = tagName.replace(/two/gi,   "2");
    tagName = tagName.replace(/one/gi,   "1");
    tagName = tagName.replace(/zero/gi,  "0");


    // Rewrite *N*..*half* to *N-5* (such as "4-ana-half-stars"), same for three-quarters and quarter
    tagName = tagName.replace(/(.*)?(\d)[a-z0-9 \-]*half(.*)/gi,  "$1$2-5$3");
    tagName = tagName.replace(/(.*)?(\d)[a-z0-9 \-]*[three|3]-quarters?(.*)/gi,  "$1$2-75$3");
    tagName = tagName.replace(/(.*)?(\d)[a-z0-9 \-]*quarter(.*)/gi,  "$1$2-25$3");


    // Attempt to match and re-write "N-N-stars|clouds" to "stars|clouds-N-N"
    // [1] = leading text, [2] = first digit, [3] = second digit, [4]=stars|clouds, [5]=trailing text
    let tagMatchWhole    = /(.*)([0-5])[ |-]([0-9]{1,2})[ |-](stars|clouds)(.*)/i.exec(tagName);
    // Attempt to match and re-write "N-stars|clouds" to "stars|clouds-N"
    let tagMatchPartial  = /(.*)([0-5])[ |-](stars|clouds)(.*)/i.exec(tagName);

    // Rewrite tag to standard format
    if (tagMatchWhole != null) {
        tagName = tagMatchWhole[1] + tagMatchWhole[4] + '-' + tagMatchWhole[2] + '-' + tagMatchWhole[3] + tagMatchWhole[5];
    }
    else if (tagMatchPartial != null) {
        tagName = tagMatchPartial[1]  + tagMatchPartial[3] + '-' + tagMatchPartial[2] + tagMatchPartial[4];
    }

    return(tagName);
}


//
// Append an <img> tag with the given image data to an element
//
function appendImage(parentObj, imgData)
{
    var tagImg     = document.createElement('img');
        tagImg.src = imgData;
    parentObj.appendChild(tagImg);
}


//
// Append a <span> tag as a rating label (with a trailing space) to an element.
// The label won't be added if the text is blank or has the generic name "rating"
//
function appendTagLabel(parentObj, labelText, styleMode)
{
    if ((labelText != "") && (labelText != "rating"))
    {
        var tagSpan                   = document.createElement('span');

        tagSpan.textContent           = labelText;

        if (styleMode == 'with-style') {
            tagSpan.style.color           = "#555";
            tagSpan.style.backgroundColor = "#ddd";
            tagSpan.style.borderRadius    = "2px";
            tagSpan.style.padding         = "2px 5px 2px 5px";
            tagSpan.style.marginRight     = "5px";
        }

        parentObj.appendChild(tagSpan);
    }
}


//
// Append an empty <span> tag to an element to help with detecting tag rename events
//
function appendRenameCanary(parentObj)
{
    var tagSpan           = document.createElement('span');
    tagSpan.style.display = "none";
    tagSpan.className     = "tagRenameCanary";

    parentObj.appendChild(tagSpan);
}


//
// Render a tag rating based on a type ("stars","clouds) and a numeric value in tag format ("4-0","1-5", etc)
//
function renderTagImages(parentObj, imgType, imgValue)
{
    var valMax = 5.0;
    var valOn  = parseFloat( imgValue.replace("-", ".") );
    var valOff = valMax - valOn;

    if ((imgType == "stars") || (imgType == "clouds"))
    {
        // Render whole "on" icons first
        while (valOn > 0.75) {
            appendImage(parentObj, tagImages[ imgType + '-on' ].imgData );
            valOn -= 1.0;
        }

        // Render 0.25 increment "on" icons if needed
        switch(valOn) {
          case 0.25:
            appendImage(parentObj, tagImages[ imgType + '-025' ].imgData );  break;
          case 0.5:
            appendImage(parentObj, tagImages[ imgType + '-half' ].imgData );  break;
          case 0.75:
            appendImage(parentObj, tagImages[ imgType + '-075' ].imgData );  break;
        }

        // Render the remaining slots as placeholders ("off")
        while (valOff >= 1) {
            appendImage(parentObj, tagImages[ imgType + '-off' ].imgData );
            valOff -= 1.0;
        }
    }
}

//
//  Check if the rating value is within the support range and increment
//  0.25 to 5.0, increments of 0.25
//
function isRatingValueValid(valRate)
{
    let valRounded = (Math.round(valRate * 4) / 4).toFixed(2);
    return( (valRate == valRounded) && (valRounded >= 0.25) && (valRounded <= 5.0) );
}



//
//  Find links with matching tag text and convert them to the paired images
//  (non-jquery version to avoid GoodReads breakage with jquery version conflict)
//
function convertTagsToImages()
{
    var objText;
    var elAnchor;
    var elLinks = document.getElementsByTagName( 'a' );

    // Walk through all the anchor tags on the page
    for ( var i = 0; i < elLinks.length; i++ ) {

        elAnchor = elLinks[ i ];

        // Only convert anchor tags which haven't already been inspected
        if (elAnchor.hasAttribute("data-tag-image-inspected") == false)
        {
            let nodeText = elAnchor.text;

            // Only convert tags with "star" or "cloud" in the name
            let match = /star|cloud/i.exec(nodeText);

            // Ignore strings with the GoodReads format of 'N of N stars' in the formal (non-tag) rating area
            // (Narrowing scope of anchor node search would remove need for this)
            let reject = /.*\d of \d stars.*/i.exec(nodeText);

            // TODO: Consider option to disable 1/4 and 3/4 stars
            // Removed: Rejecting -NN (ex: star-35, stars-3-25)
            // let reject = /-\d\d/i.exec(nodeText);

            if ((match != null) && (reject == null))
            {
                // Rework the tag format to be as standardized as possible
                nodeText = rewiteAlternateRatingFormats(nodeText);

                // match[0] = full match text, [1] = optional label, [2] = "stars" or "clouds",
                //      [3] = "N1-N2" where (ideally) N1 is a digit 0-9 and N2 is 0 or 5
                let match = /([\w-]*?)-*(stars|clouds)-(\d+(-\d{1,2})?)/i.exec(nodeText);

                // Only allow valid rating numeric values. Reject match if invalid
                if (match != null)
                    if (!isRatingValueValid( parseFloat(match[3].replace("-", ".")) ) )
                        match = null;

                if (match != null) {

                    // Strip out tag name (tag will get appended further below)
                    let sRegExInputL = new RegExp(match[0] + '.*', 'g');
                    let sRegExInputR = new RegExp('.*' + match[0], 'g');

                    let nodeTextLeft = nodeText.replace(sRegExInputL, "");
                    let nodeTextRight = nodeText.replace(sRegExInputR, "");

                    // Append left side of non-tag text
                    // (This used to use innerhtml)
                    elAnchor.text = "";
                    elAnchor.text = nodeTextLeft;

                    // Append the tag label, if suitable
                    appendTagLabel(elAnchor, match[1], 'with-style');

                    // Render tag image
                    renderTagImages(elAnchor, match[2], match[3]);

                    // Append any trailing text
                    appendTagLabel(elAnchor, nodeTextRight, 'no-style');

                    // Prevent line breaks in the middle of rating images and labels
                    elAnchor.style.whiteSpace="nowrap";

                } // End regex string match test


                // If it's a tag on the edit-shelves page then add a shim to detect when they get renamed
                if (elAnchor.className.indexOf('displayShelfNameLnk') > -1) {
                    appendRenameCanary(elAnchor);
                }

                // Flag the anchor has having been inspected so it won't get images appended
                // multiple times if the page is re-scanned to catch dynamic content (if tag text was not cleared).
                //
                //   Note : Data set name becomes "data-tag-image-inspected" when referenced as an Attribute.
                //
                elAnchor.dataset.tagImageInspected = "true";

            } // End: Only convert tags with "star" or "cloud" in the name

        } // End previously inspected test

    } // End loop through all matching elements
}


// A couple globals
var tagImages = Object.create(null);  // Hash for storing tag image data by key name
var strInfiniteScrollStatusLast;
var objInfiniteStatusDiv;

// Initialize our tag images
initImageData();

// Convert any tags found on the page
convertTagsToImages();

// Install hooks for converting dynamic content that appears after initial page load
installInfiniteScrollHook();
installTagShelfUpdateHook();
installPopupReviewHook();
installEditShelfHook();

