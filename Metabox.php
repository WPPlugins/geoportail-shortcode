<?php

$setting_builder_map = get_option("geomap_builder");

if (isset($setting_builder_map) && $setting_builder_map == "on") {
	add_action('admin_menu', 'WP_GEOPORTAL_meta_boxes');
}

if ( !function_exists('WP_GEOPORTAL_meta_boxes') ):
	function WP_GEOPORTAL_meta_boxes() { 
			$id = "geoportail_shortcode_builder";
			$title = "Geoportail Shortcode Builder"; 
			$context = "normal";
			add_meta_box($id, $title, 'WP_GEOPORTAL_render_shortcode_builder_form', 'post', $context, 'high');
			add_meta_box($id, $title, 'WP_GEOPORTAL_render_shortcode_builder_form', 'page', $context, 'high');
	}
endif;


if ( !function_exists('WP_GEOPORTAL_render_shortcode_builder_form') ):
	function WP_GEOPORTAL_render_shortcode_builder_form() {

		WP_GEOPORTAL_render_config_form("Builder");
		
	}
endif;
?>
