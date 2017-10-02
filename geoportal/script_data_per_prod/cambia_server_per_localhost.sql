-- System Settings (GEOPORTAL.ICF.GOB.HN)
update geoportal.system_settings set value = 'http://localhost:8081/geoserver' where key = 'GEOSERVER_URL';
update geoportal.system_settings set value = 'http://localhost:8080/geonetwork' where key = 'GEONETWORK_URL';
update geoportal.system_settings set value = 'http://localhost:8080/geoportal/images/legends/denuncias.png' where key = 'ALERTS_LEGEND_URL';
update geoportal.system_settings set value = 'http://localhost:8080/geoportal/images/legends/dIBUJO.png' where key = 'REDLINES_LEGEND_URL';

-- Layersources
update geoportal.layersources set s_url = 'http://localhost:8081/geoserver/icf/wms' where s_layersource_name = 'WMS Geoserver ICF';
update geoportal.layersources set s_cache_url = 'http://localhost:8081/geoserver/gwc/service/wms' where s_layersource_name = 'WMS Geoserver ICF';

-- Layers
update geoportal.layers set s_wfs_url = 'http://localhost:8081/geoserver/icf/wfs' where s_wfs_url = 'http://geoportal-mosef.gesp.it/geoserver/icf/wfs';
update geoportal.layers set s_wcs_url = 'http://localhost:8081/geoserver/icf/wcs' where s_wcs_url = 'http://geoportal-mosef.gesp.it/geoserver/icf/wcs';

-- Layer confgis
update geoportal.layerconfigs set s_cache_url = 'http://localhost:8081/geoserver/gwc/service/wms' where s_cache_url = 'http://geoportal-mosef.gesp.it/geoserver/gwc/service/wms';
update geoportal.layerconfigs set s_cache_workspace = 'icf' where s_cache_url = 'http://localhost:8081/geoserver/gwc/service/wms';