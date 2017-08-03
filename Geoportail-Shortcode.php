<?php
/*
Plugin Name: Geoportail-Shortcode-beta
Description: Use API Geoportail in Wordpress
Version: 2.4.4
*/

include_once plugin_dir_path( __FILE__ ).'/Metabox.php';
include_once plugin_dir_path( __FILE__ ).'/Admin.php';
include_once plugin_dir_path( __FILE__ ).'/Install.php';
include_once plugin_dir_path( __FILE__ ).'/Form-Builder.php';
include_once plugin_dir_path( __FILE__ ).'/GPX.php';
include_once plugin_dir_path( __FILE__ ).'/Database.php';

/*----------------------------------------------------------------------------*\
* Installation
\*----------------------------------------------------------------------------*/
register_activation_hook(__FILE__,'WP_GEOPORTAL_install');
register_activation_hook(__FILE__,'WP_GEOPORTAL_install_bd');
register_activation_hook(__FILE__,'WP_GEOPORTAL_install_bd_data');
//check db version
add_action('plugins_loaded', 'WP_GEOPORTAL_update_db_check');
/*----------------------------------------------------------------------------*\
* Desintallation
\*----------------------------------------------------------------------------*/
register_deactivation_hook( __FILE__, 'WP_GEOPORTAL_remove');

/*----------------------------------------------------------------------------*\
* enqueue script
\*----------------------------------------------------------------------------*/
add_action('wp_enqueue_scripts', 'WP_GEOPORTAL_enqueue_scripts');
add_action('admin_enqueue_scripts', 'WP_GEOPORTAL_enqueue_scripts');

/*----------------------------------------------------------------------------*\
* add_shortcode
\*----------------------------------------------------------------------------*/
add_shortcode('geoportail', 'WP_GEOPORTAL_shortcode');
/*----------------------------------------------------------------------------*\
* enqueue_WP_GEOPORTAL_scripts
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_enqueue_scripts()
{

/*
	TODO: pour modifier le CSS
	wp_deregister_style( 'geomap-style' );
	wp_register_style( 'geomap-style', plugins_url('/style.css', __FILE__));
	wp_enqueue_style( 'geomap-style' );
*/


	wp_deregister_script( 'geomap-script' );
	wp_register_script( 'geomap-script', plugins_url('/js/geoportail-shortcode.js', __FILE__), array('jquery'));
	//wp_register_script( 'geomap-script', plugins_url('/js/geoportail-shortcode.min.js', __FILE__), array('jquery'));
	wp_enqueue_script( 'geomap-script' );
	
	if(get_option('geomap_graph') == 'on')
	{
		wp_deregister_script('flot');
		wp_register_script('flot', plugins_url('/js/flot/jquery.flot.min.js', __FILE__), array("jquery"));
		wp_enqueue_script('flot');
	
		wp_deregister_script('flot.crosshair');
		wp_register_script('flot.crosshair',
			plugins_url('/js/flot/jquery.flot.crosshair.min.js', __FILE__), array("jquery","flot"));
		wp_enqueue_script('flot.crosshair');
	}
	
	if (get_option('geomap_key') != '' )
	{
		?>
				<script type="text/javascript">
					var API_KEY="<?php echo get_option('geomap_key') ?>";
					var API_VERSION="<?php echo get_option('geomap_apiVersion'); ?>";
				</script>
		<?php
		wp_deregister_script( 'api-geoportail' );
		wp_register_script( 'api-geoportail',
			"http://api.ign.fr/geoportail/api/js/". get_option('geomap_apiVersion') ."/Geoportal.js");
		wp_enqueue_script( 'api-geoportail' );
		
		wp_deregister_style( 'geoportail-style' );
		wp_register_style( 'geoportail-style',
			"http://api.ign.fr/geoportail/api/js/". get_option('geomap_apiVersion') ."/theme/geoportal/style.css");
		wp_enqueue_style( 'geoportail-style' );
		
	}
	
		/* TODO: pour la météo avec OWM
		wp_deregister_script( 'openweathermap' );
		wp_register_script( 'openweathermap',"http://openweathermap.org/js/OWM.OpenLayers.1.2.js");
		wp_enqueue_script( 'openweathermap' );
		*/
}
/*----------------------------------------------------------------------------*\
* WP_GEOPORTAL_shortcode
\*----------------------------------------------------------------------------*/
function WP_GEOPORTAL_shortcode($attr) {
	global $post;
/******************************************************************************/
// default atts
	$attr = shortcode_atts(
			array(	
				'lat'						=> get_option("geomap_lat"), 
				'lon'						=> get_option("geomap_lon"),
				'id'	 					=> '',
				'type'					=> get_option("geomap_type"), // normal ou mini
				'layers_array' 	=> get_option("geomap_layers_array"),
				'territory'			=> get_option("geomap_territory"),
				'z' 						=> get_option("geomap_z"),
				'w' 						=> get_option("geomap_w"),
				'h' 						=> get_option("geomap_h"),
				'kml_array'			=> '',
				'gpx_array'			=> '',
				'wms' 					=> '',
				'wms_layer'			=> '',
				'wms_title' 		=> 'couche_wms',
				'geolocate'			=> 'false',
				'geotag'				=> 'false',
				'gpx_graph'			=> 'false',
				'id_map'				=> ''
				), $attr);
/******************************************************************************/
	$post_id = $post->ID;
	$attr['id'] = 'geoportail_'. $post_id .'_'. $attr['id'];
	
	$returnme = '
		<style type="text/css">
			.entry-content img {max-width: 100000%; /* override */}

			div#map_'. $attr['id'] .' {
				background-color:white;
				background-image:url(http://api.ign.fr/geoportail/api/js/'. get_option('geomap_apiVersion') .'/theme/geoportal/img/loading.gif);
				background-position:center center;
				background-repeat:no-repeat;
			}
		</style>
	';
/*************************************************************************/
	$returnme .= '
		<div id="geowp_'. $attr['id'] .'" style="clear:both; ">
			<div id="map_'. $attr['id'] .'" style="width:' . $attr['w'] . 'px; height:' . $attr['h'] . 'px;  text-align:center;margin-left:auto; margin-right:auto; "> </div>
	';
//	if($attr['gpx_graph'] != 'false' && get_option('geomap_graph') == 'on')
	if(get_option('geomap_graph') == 'on')
	{
		$returnme .= '
	  	<div id="plot_'. $attr['id'] .'" style="margin-top:25px; width:' . $attr['w'] . 'px; height:250px;  text-align:center; margin-left:auto; margin-right:auto; display:none; "> </div>
	  	<div id="plot_'. $attr['id'] .'_speed" style="margin-top:25px; width:' . $attr['w'] . 'px; height:250px;  text-align:center; margin-left:auto; margin-right:auto; display:none;"> </div>
	  ';
	}
	$returnme .= '
		  <div class="entry-meta">
				<a href="http://wordpress.org/extend/plugins/geoportail-shortcode/"> Geoportail Shortcode </a>
			</div>
	  </div>
	  ';

if($attr['id_map'] != "")
{
	$returnme .= '
		<script type="text/javascript">
			var ajaxurl = "'. admin_url('admin-ajax.php') .'";
			
			jQuery(window).load(function() {
				WP_GEO_get_and_display_map('. $attr['id_map'] .',"'. $attr['id'] .'");
			});
		</script>
	';
	return $returnme;
}
/*************************************************************************/
// Avanced Layers

	$layers_array = preg_split("/;/",$attr['layers_array'],-1,PREG_SPLIT_NO_EMPTY);

	foreach( $layers_array as $layer )
	{
		if (gettype($layer)!==gettype(array()))
			$layer = preg_split("/[\s|]+/",$layer,-1,PREG_SPLIT_NO_EMPTY);
			
		if($layer[0] == "ortho")
			$layer[0] = "ORTHOIMAGERY.ORTHOPHOTOS:WMSC";
			
		if($layer[0] == "map")
			$layer[0] = "GEOGRAPHICALGRIDSYSTEMS.MAPS:WMSC";
			
		$visibility = 1;
		$opacity = 1;
		
		if (count($layer) >= 2)
		{
			if($layer[1] == 'on')
				$visibility =1;
			else
				$visibility =0;
		}
		if (count($layer) >= 3)
			$opacity = $layer[2];

		$temp_layer["name"] = $layer[0];
		$temp_layer["opacity"] = $opacity;
		$temp_layer["visibility"] = $visibility;
		$layers_php[] = $temp_layer;
	}
	$param['layers_array'] = $layers_php;

/*************************************************************************/
//kml_array

		if($attr['kml_array'] != '') 
		{	
			if (gettype($attr['kml_array'])!==gettype(array()))
				$attr['kml_array'] = preg_split("/;/",$attr['kml_array'],-1,PREG_SPLIT_NO_EMPTY);

			foreach( $attr['kml_array'] as $kml )
			{
				if (gettype($kml)!==gettype(array()))
					$kml = preg_split("/,/",$kml,-1,PREG_SPLIT_NO_EMPTY);
				if (count($kml) == 1)
					$kml[]='KML_Layer';
				if (count($kml) == 2)
				{
					$temp_kml['name'] = $kml[1];
					$temp_kml['url'] = $kml[0];
					$kml_array_php[] = $temp_kml;
				}
			}
			$param['kml_array'] = $kml_array_php;
		}
/*************************************************************************/
//gpx_array
		if($attr['gpx_array'] != '') 
		{
			if (gettype($attr['gpx_array'])!==gettype(array()))
				$attr['gpx_array'] = preg_split("/;/",$attr['gpx_array'],-1,PREG_SPLIT_NO_EMPTY);

			foreach( $attr['gpx_array'] as $gpx )
			{
				if (gettype($gpx)!==gettype(array()))
					$gpx = preg_split("/,/",$gpx,-1,PREG_SPLIT_NO_EMPTY);
				//gpx : url,name,color
				
				// Out : maps, graph, waypoints 
				$tab = WP_GEOPORTAL_parseGPX($gpx[0],false);
				
				if (count($gpx) == 1)
					$gpx[]='GPX_Layers';
					
				if($attr['gpx_graph'] != 'false' && get_option('geomap_graph') == 'on')
				{
					$temp_chart['name'] = $gpx[1];
					$temp_chart['data'] = $tab["graph"];
					$chart_array_php[] = $temp_chart;
					///
					$temp_gpx['data'] = $tab["graph"];

				}


				if (count($gpx) == 2)
				{
					$temp_gpx["name"] = $gpx[1];
					$temp_gpx["url"]  = $gpx[0];
					$temp_gpx["maps"] = $tab["maps"];
					$temp_gpx["waypoints"] = $tab["waypoints"];
					$gpx_array_php[] = $temp_gpx;
				}
			}
			$param['gpx_array'] = $gpx_array_php;
		}
/*************************************************************************/
//wms
//TODO
/*
		if($attr['wms'] != '') 
		{
			$returnme .= '
					map.addLayer(
						"WMS",
						"' . $attr['wms_title'] . '",
						"' . $attr['wms'] . '",
	                		   	{layers: "' . $attr['wms_layer'] . '"},
		                   		{transitionEffect: "resize"}	
					);
			';
		}
*/
/*************************************************************************/
//geotags
	//si geotag : on modifie lat/lon
	if($attr['geotag'] != 'false')
	{
		$post_id = $post->ID;
		$lon = get_post_meta($post_id, 'geo_longitude', true);
		$lat = get_post_meta($post_id, 'geo_latitude', true);
		// geo_public & geo_enabled
		$geo_public = get_post_meta($post_id, 'geo_public', true);
		$geo_enabled = get_post_meta($post_id, 'geo_enabled', true);
		if ($geo_public == '1' && $geo_enabled =='1')
		{
			$attr['lat'] = $lat;
			$attr['lon'] = $lon;
		}
	}

/*************************************************************************/
//TODO : wms ...
//jQuery(document).ready(function() {
//jQuery(window).load(function() {

	$param['id'] 			= $attr['id'];
	$param['type'] 		= $attr['type'];
	$param['lat']  		= $attr['lat'];
	$param['lon']  		= $attr['lon'];
	$param['z']  			= $attr['z'];
	$param['territory']  = $attr['territory'];
	$param['geolocate']  = $attr['geolocate'];
	$param['graph']  		 = $attr['gpx_graph'];

	$returnme .= '
		<script type="text/javascript">
			jQuery(window).load(function() {
				WP_GEO_create_map('. json_encode($param) .');
		';
	
	if( count($chart_array_php) != 0)
	{
		$param_chart['id']  = $attr['id'];
		$param_chart['data_array']  = $chart_array_php;
		$returnme .= '
				WP_GEO_create_chart('. json_encode($param_chart) .');
			';
	}
	
	$returnme .= '
			});
		</script>
		';
	return $returnme;
}

?>
