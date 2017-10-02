delete from geoportal.alerts;
delete from geoportal.alert_status_history;
delete from geoportal.alert_geom_line;
delete from geoportal.alert_geom_point;
delete from geoportal.alert_geom_polygon;
delete from geoportal.comments;
delete from geoportal.logs;
delete from geoportal.redlining_line;
delete from geoportal.redlining_point;
delete from geoportal.redlining_polygon;
delete from geoportal.users where f_deleted = true