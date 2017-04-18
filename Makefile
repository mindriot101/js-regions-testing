DOCDIR := doc

doc:
	rm -rf ${DOCDIR}
	mkdir -p ${DOCDIR}
	./node_modules/.bin/tsc -p .
	cp -r app ${DOCDIR}
	cp index.html ${DOCDIR}
	cp image.png regions.json ${DOCDIR}
	sed -i '' 's#node_modules/jquery#https://unpkg.com/jquery@3.2.1#g' ${DOCDIR}/index.html
	sed -i '' 's#node_modules/bootstrap#https://unpkg.com/bootstrap@3.3.7#g' ${DOCDIR}/index.html
	ghp-import doc
	git push origin gh-pages

.PHONY: doc
