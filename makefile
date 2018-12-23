goodreads-rating-half-stars:
	# Chrome (build packaged extension AND zip file for uploading)
	rm -f build/goodreads-rating-half-stars-cr.crx
	rm -f src.crx
	rm -f build/goodreads-rating-half-stars.cr.zip
	# Chrome errors out with --headless --disable-gpu
	chromium-browser --pack-extension=./src --pack-extension-key=./goodreads-rating-half-stars-chrome.pem
	mv src.crx build/goodreads-rating-half-stars.crx
	cd src; zip -r ../build/goodreads-rating-half-stars-cr.zip *; cd ..

	# Firefox
	rm -f build/goodreads-rating-half-stars-ff.zip
	cd src; zip -r ../build/goodreads-rating-half-stars-ff.zip *; cd ..

clean:
	rm -f build/goodreads-rating-half-stars.crx
