<?php

/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_install
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_install() {

	add_option("geomap_lat", "46", "", "yes");
	add_option("geomap_lon", "2" , "", "yes");
	add_option("geomap_z", "4" , "", "yes");
	
	add_option("geomap_w", "600" , "", "yes");
	add_option("geomap_h", "400" , "", "yes");
	
	add_option("geomap_key", "" , "", "yes");
	add_option("geomap_apiVersion", "latest" , "", "yes");

	add_option("geomap_type", "normal" , "", "yes");
	add_option(
	 "geomap_layers_array",
	 "ORTHOIMAGERY.ORTHOPHOTOS:WMSC|on|1;GEOGRAPHICALGRIDSYSTEMS.MAPS:WMSC|on|0.4;",
	 "",
	 "yes"
	);
	add_option("geomap_territory", "FXX" , "", "yes");
	add_option("geomap_builder", "on" , "", "yes");
	add_option("geomap_graph", "on" , "", "yes");
	
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_remove
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_remove() {

	delete_option("geomap_lat");
	delete_option("geomap_lon");
	delete_option("geomap_z");
	
	delete_option("geomap_w");
	delete_option("geomap_h");

	delete_option("geomap_key");
	delete_option("geomap_apiVersion");
	
	delete_option("geomap_type");
	delete_option("geomap_layers_array");
	delete_option("geomap_territory");
	delete_option("geomap_builder");
	delete_option("geomap_graph");

}
?>
