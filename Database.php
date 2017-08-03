<?php

global $geomap_db_version;
$geomap_db_version = "1.0";

/*----------------------------------------------------------------------------*\
* add action ajax
\*----------------------------------------------------------------------------*/
add_action('wp_ajax_get_map', 'WP_GEOPORTAL_get_map_callback');
add_action('wp_ajax_nopriv_get_map', 'WP_GEOPORTAL_get_map_callback');
add_action('wp_ajax_save_map', 'WP_GEOPORTAL_save_map_callback');
add_action('wp_ajax_update_map', 'WP_GEOPORTAL_update_map_callback');
add_action('wp_ajax_remove_map', 'WP_GEOPORTAL_remove_map_callback');
add_action('wp_ajax_get_gpx', 'WP_GEOPORTAL_get_gpx_callback');
add_action('wp_ajax_nopriv_get_gpx', 'WP_GEOPORTAL_get_gpx_callback');
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_get_gpx_callback
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_get_gpx_callback() {

	$url = $_POST['url'];
	
	// Out : maps, graph, waypoints 
	$tab = parseGPX($url);

	echo json_encode($tab);

	die(); // this is required to return a proper result
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_get_map_callback
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_get_map_callback() {

	$id = intval( $_POST['id'] );

	$map = WP_GEOPORTAL_get_map_by_id($id);
	if($map)
	  echo stripslashes_deep(json_encode($map));
	else
		echo "";

	die(); // this is required to return a proper result
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_save_map_callback
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_save_map_callback() {
	
	$name = $_POST['name'];
	$data = $_POST['data'];

	$id = WP_GEOPORTAL_add_map($name,$data);
	
	if($id)
	  echo $id;
	else
		echo "";

	die(); // this is required to return a proper result
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_update_map_callback
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_update_map_callback() {
	
	$name = $_POST['name'];
	$data = $_POST['data'];
	$id 	= $_POST['id'];

	
	$out = WP_GEOPORTAL_update_map_by_id($id,$name,$data);
	if($out)
	  echo $out;
	else
		echo "";

	die(); // this is required to return a proper result
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_remove_map_callback
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_remove_map_callback() {
	
	$id 	= $_POST['id'];

	$out = WP_GEOPORTAL_remove_map_by_id($id);
	if($out)
	  echo $out;
	else
		echo "";

	die(); // this is required to return a proper result
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_install_bd
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_install_bd() {
	global $wpdb;
	global $geomap_db_version;

	$table_name = $wpdb->prefix . "geomap";

	$installed_ver = get_option( "geomap_db_version" );

	if( $installed_ver != $geomap_db_version )
	{
		$sql = "CREATE TABLE $table_name (
  id mediumint(9) NOT NULL AUTO_INCREMENT,
  time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
  name tinytext NOT NULL,
  data text NOT NULL,
  UNIQUE KEY id (id)
    );";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
   	dbDelta($sql);
 
   	update_option("geomap_db_version", $geomap_db_version);
	}
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_install_bd_data
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_install_bd_data() {
   global $wpdb;
   
   $table_name = $wpdb->prefix . "geomap";
   
   $map_name = "Default";
   $map_data = '{
   			"id":"1",
   			"territory":"FXX",
   			"lat":"46","lon":"2","z":"4",
   			"w":"600","h":"400",
   			"type":"normal",
   			"geolocate":"false",
   			"graph":"false",
   			"layers_array":"[
   					{"name":"GEOGRAPHICALGRIDSYSTEMS.MAPS:WMSC","opacity":"0.4","visibility":true},
   					{"name":"ORTHOIMAGERY.ORTHOPHOTOS:WMSC","opacity":"1","visibility":true}
   				]",
   			"gpx_array":"[]",
   			"kml_array":"[]"
   		}';

   return $wpdb->insert( $table_name, array( 'time' => current_time('mysql'), 'name' => $map_name, 'data' => $map_data ) );
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_update_db_check
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_update_db_check() {
    global $geomap_db_version;
    if (get_site_option('geomap_db_version') != $geomap_db_version) {
        WP_GEOPORTAL_install_bd();
    }
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_get_all_maps()
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_get_all_maps() {
	global $wpdb;
	$table_name = $wpdb->prefix . "geomap";
	
	return $wpdb->get_results( " SELECT id,name FROM $table_name ");
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_get_map_by_id()
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_get_map_by_id($id) {
	global $wpdb;
	$table_name = $wpdb->prefix . "geomap";

	return $wpdb->get_row($wpdb->prepare( 
		"SELECT * FROM $table_name WHERE id = %d",
		$id
		) , ARRAY_A
	);
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_remove_map_by_id()
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_remove_map_by_id($id) {
	global $wpdb;
	$table_name = $wpdb->prefix . "geomap";

	return $wpdb->query( $wpdb->prepare( 
		" DELETE FROM $table_name WHERE id = %d ",
	  $id
  ));
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_update_map_by_id()
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_update_map_by_id($id,$map_name,$map_data) {

	global $wpdb;
	$table_name = $wpdb->prefix . "geomap";
	
	return $wpdb->update( 
			$table_name,
			array( 'time' => current_time('mysql'),
						 'name' => $map_name,
						 'data' => $map_data ),
			array( 'id' => $id )
		);
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_add_map()
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_add_map($map_name,$map_data) {
	global $wpdb;
	$table_name = $wpdb->prefix . "geomap";
	
	$rows_affected = $wpdb->insert(
			$table_name,
			array( 'time' => current_time('mysql'),
						 'name' => $map_name,
						 'data' => $map_data )
		);
	return $wpdb->insert_id;
}
?>
