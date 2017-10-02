#!/bin/bash
# Eseguire da Desktop

perl -p -i -e 's/^.*Created with the Personal Edition of HelpNDoc.*$//g' `find manuale/Gestionale -name *.html`
perl -p -i -e 's/^.*Created with the Personal Edition of HelpNDoc.*$//g' `find manuale/Gis -name *.html`

