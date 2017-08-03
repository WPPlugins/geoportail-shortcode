<?php
/*
// Adds new supported media types for upload : kml & gpx
function geoMimes($mimes)
{
	$mimes = array_merge($mimes, array(
		'kml' => 'application/octet-stream',
		'gpx' => 'application/octet-stream'
	));

	return $mimes;
}

// Add the new filter
if (function_exists('add_filter'))
{
	add_filter('upload_mimes', 'geoMines');
}
*/

if ( is_admin() ){

	function WP_GEOPORTAL_admin_menu() {

		if (function_exists('add_options_page'))
		{
			add_options_page(
				'WP Geoportail ShortCode',
				'WP Geoportail ShortCode',
				'administrator',
				'WP-Geoportail-ShortCode',
				'WP_GEOPORTAL_html_page'
			);
		}
	} //function

	if (function_exists('add_action'))
	{
		add_action('admin_menu', 'WP_GEOPORTAL_admin_menu');
	}
}//if

function WP_GEOPORTAL_html_page() {

	// See if the user has posted us some information
	// If they did, this hidden field will be set to 'Y'

	if( isset($_POST['submit_hidden']) && $_POST['submit_hidden'] == 'Y' )
	{
	    // Read/Save Values 
	    $temp = str_replace(",", ".", $_POST['geomap_lat']);
	    update_option('geomap_lat', $temp );
	    
	    $temp = str_replace(",", ".", $_POST['geomap_lon']);
	    update_option('geomap_lon', $temp );
	    
	    $temp = $_POST['geomap_type'];
	    update_option('geomap_type', $temp );
	   
	    $temp = $_POST['geomap_territory'];
	    update_option('geomap_territory', $temp );
	 
	    $temp = $_POST['geomap_z'];
	    update_option('geomap_z', $temp );
	    
	    $temp = $_POST['geomap_w'];
	    update_option('geomap_w', $temp );
	    
	    $temp = $_POST['geomap_h'];
	    update_option('geomap_h', $temp );
	    
 	    $temp = $_POST['geomap_layers_array'];
	    if($temp != "")
		    update_option('geomap_layers_array', $temp);
	    
	    $temp = $_POST['geomap_key'];
	    update_option('geomap_key', $temp );

	    $temp = $_POST['geomap_apiVersion'];
	    update_option('geomap_apiVersion', $temp );

		 $temp = $_POST['geomap_builder'];
	    update_option('geomap_builder', $temp );
	    
	   $temp = $_POST['geomap_graph'];
	    update_option('geomap_graph', $temp );
	   
	   //
	   $map_data = $_POST['geomap_maps_param'];
	   $map_name = "Default";
	   $id = 1;
	   
	   $statut = "database issue";
	   $statut = WP_GEOPORTAL_update_map_by_id($id,$map_name,$map_data);
		 if( WP_GEOPORTAL_update_map_by_id($id,$map_name,$map_data))
	   	 $statut = "OK";
			
	    // Put an settings updated message on the screen
		?>
	<div class="updated">
		<center><p><strong><?php _e('WP Geoportail ShortCode Paramètres sauvegardés : '. $statut, 'menu-test' );  ?></strong></p></center>
	</div>
		<?php
	}

	WP_GEOPORTAL_render_config_form("Admin");
	
	?>
		<input type="hidden" name="geomap_layers_array" id="geomap_layers_array" value="" />
		<input type="hidden" name="geomap_maps_param" id="geomap_maps_param" value="" />
		<p>
			<input type="submit" value="<?php _e('Sauver les changements') ?>" />
		</p>

	</form>
</div>

<?php

}

?>
