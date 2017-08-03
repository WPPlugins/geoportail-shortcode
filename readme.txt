=== Geoportail Shortcode ===
Contributors: geoWP
Tags: geoportail, api geoportail, IGN, France, carte, google, google maps, google maps api, kml, gpx, shortcode, shortcodes, map, mapping, maps, latitude, longitude, api, 2012, v1.3, geolocation, geolocate, geotagging, geotag, altitude, graph
Requires at least: 2.8
Tested up to: 3.4.1
Stable tag: 2.4.4
Last updated:  17/09/2013

This plugin allows you to add one map (via the Geoportail API) to your page/post using shortcode. 

== Description ==

Une documentation en français est disponible à  l'adresse suivante : http://geo.wp.cephee.fr/geoportail-shorcode/

This plugin allows you to add a Geoportail map into your post/page using shortcode. 
To use it, you need a free key from : http://pro.ign.fr/api-web
Altitude and speed graph of gpx file is available since v2.0.

Any question, idea or comment ? Please contact me at : geoportailWP(at)gmail(dot)com

Features:

* default french map
* set map size
* set zoom level
* set location by latitude/longitude
* add KML or GPX file via URL link
* change type : normal / mini
* change territory : France, Guadeloupe, Guyane, ... (cf https://api.ign.fr/geoportail/api/doc/fr/webmaster/integration.html)
* choose Layers : map, ortho (and all other layers available in the geoportail https://api.ign.fr/geoportail/api/doc/fr/webmaster/layers.html )
* change Layers settings : visibility / opacity
* use geolocalisation : show where I'm !
* use geotagging : show where the post have been written.
	this functionnality need the geolocation plugin : http://wordpress.org/extend/plugins/geolocation
* easy create your own shortcode using Shortcode Builder
* display altitude graph of gpx files

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload `geoportail-shortcode` directory to the `/wp-content/plugins/` directory
1. Go to http://api.ign.fr/geoportail to have your free api key. 
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Set your api key in the 'WP Geoportail Shortcode' menu, through 'Settings' menu.
1. Add shortcode in your posts (ex: [geoportail w="400" h="300"/])

== Frequently Asked Questions ==

= How can use the geolocalisation function? =

Using the geolocate parameter :

Ex: [geoportail  geolocate="true" /]

= How can use the geotagging function? =

Using the geotag parameter :

Ex: [geoportail  geotag="true" /]

= How can i set my API key? =

Using the 'WP Geoportail Shortcode' menu, through 'Settings' menu.

= How do I add a map to my post? =

Using shortcode in the edit box for your post.

Ex: [geoportail /]


= Can I add multiple maps to the same post? =

Yes, you can do it using different "id" for each map.

Ex: 
[geoportail id="1" /]
[geoportail id="2" /]

= Can I change the size of the map? =
Yes, you can do it using your own width and height parameters.

Ex:
[geoportail w="400" h="300"]


= Can you add multiple KML files? =
Yes, you can do it using the "kmlArray" parameter.

Ex:
[geoportail kml_array="url1,title1;url2,title2;..."]


= Can you add multiple GPX files? =
Yes, you can do it using the "gpxArray" parameter.

Ex:
[geoportail gpx_array="url1,title1;url2,title2;..."]

= Can you change the map viewer type? =
Yes, you can do it using the "type" parameter. It can be "mini" for a mini viewer without tools panel or "normal".

Ex:
[geoportail type="mini" /]

= Can you choose your Layers? =
Yes, you can do it using the "layers" parameter. It can be "ortho" if you want only the ortho-image (aerial image) layer, "map" if you want only the map layer or "ortho, map" if you want both of them.

Ex:
[geoportail layers_array="ortho, map" /]


= Can you change the territory ? =
Yes, you can do it using the "territory" parameter. Default parameter is "FXX" : France.
It can be one of :

FXX     France mÃ©tropolitaine
GLP     Guadeloupe
GUF     Guyane
MTQ     Martinique
MYT     Mayotte
NCL     Nouvelle CalÃ©donie
PYF     PolynÃ©sie FranÃ§aise
REU     RÃ©union
SPM     Saint Pierre et Miquelon
WLF     Wallis et Futuna
ANF     Antilles FranÃ§aise (GLP, MTQ, SMA, SBA)
CRZ     Crozet
EUE     Union EuropÃ©enne
KER     Kerguelen
SBA     Saint-BarthÃ©lÃ©my
SMA     Saint-Martin
WLD     La Terre

Ex:
[geoportail territory="GLP" /]

== Screenshots ==
1. The map in an article
2. Settings Screen

== Changelog ==

= 2.4.4 =
* Fix incompatibility with wp-gpx-map

= 2.4.3 =
* Form-Builder is now working.
Please remove your old maps in the shortcode option menu.

= 2.4.2 =
* Fix api loading issu
* Include geoportail css
* Known issues : Form-Builder : works randomly, please don't use it for now.

= 2.4.1 =
* Try to fix apiVersion bug

= 2.4 =
* No more compatible with api version < v2.0beta, (please ask a new api key at http://pro.ign.fr/api-web)
* Shorcode builder improvement:
	- maps parameter are now save in a database,
	- allows preview of gpx file.
* Speed Graph of gpx file is now available.

= 2.3 =
* Compatibility with new version of geoportal api (v2.0beta)
* and still compatible with older version

= 2.2 =
* add map preview in shortcode builder
* few improvement in interaction between altitude chart and map

= 2.1 =
* add interaction between altitude chart and map
* few code improvement

= 2.04 =
* fix centering map issue
* add marker for gpx waypoints

= 2.03 =
* fix zoom issue

= 2.02 =
* fix multiple maps on the same page
* fix problem with upload file

= 2.01 =
* fix some bug
= 2.0 =
* Introduce altitude graph

= 1.9.3 =
* fix some bug

= 1.9.2 =
* Change gpx color display to increase visibility
* Allow to display/hide shortcode builder

= 1.9 =
* Introduce Shortcode Builder
	It allow you to easy create shortcode.

= 1.8.1 =
* Fix zoom bug !

= 1.8 =
* Many changes in the menu page
* Allows configuration of all layers of the geoportail (using layers_array)
* be careful some balise change (cf Upgrade notice)

= 1.7 =
* Geotaging : use geotag="true"
* Geolocalisation : use geolocate="true"
* Multi KML/GPX file : use kml_array/gpx_array
* be careful some balise change (cf Upgrade notice)

= 1.6 =
* few improvements in Settings Screen
* ready to support the new geoportal api v1.3 (cf https://api.ign.fr/geoportail/document.do?doc=geoportail2012 )

= 1.5.2 =
* few improvements

= 1.5 =
* choose Layers : map, ortho
* change Layers settings : visibility / opacity for map & ortho

= 1.4 =
* Add option menu

= 1.3 =
* Add change territory support
* Add change viewer type support

= 1.2 =
* Add GPX support

= 1.0 =
* First release

== Upgrade Notice ==

= 2.4.2 =
* change apiVersion to "latest" in the WP Geoportail ShortCode menu.
* Active/deactive plugin if you have troubles after upgrade


= 1.9 =
* Active/deactive plugin if you have troubles after upgrade

= 1.8 =

* Be careful :
- map_visibility, ortho_visibility, map_opacity, ortho_opacity are removed, please use layers_array
- kml and kmlTitle are removed, please use kml_array
- gpx and gpxTitle are removed, please use gpx_array

= 1.7 =

* Be careful : some balise change :
mapVisibilty => map_visibility
orthoVisibilty => ortho_visibility
mapOpacity => map_opacity
orthoOpacity => ortho_opacity

* Active/deactive plugin if you have troubles after upgrade

= 1.5.2 =
* Active/deactive plugin if you have troubles after upgrade

= 1.0 =
* First release
