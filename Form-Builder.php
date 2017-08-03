<?php

function WP_GEOPORTAL_render_config_form($form_type) {

	$type = get_option('geomap_type');
	if (!($type))
		$type = 'normal';
?>

<div id='geomap_message' class='updated below-h2' style="display:none;">  </div>

<?php
	if($form_type == "Admin")
	{	
?>
<div>
<h2>WP Geoportail ShortCode</h2>
<h3>Paramètres généraux</h3>
<div id="form_builder_div" >
<?php
	}

	if($form_type == "Builder")
	{
?>
<div id="map_bd_builder" >
    <b>Attention</b> : le builder est encore en <b>béta-test</b>, en cas de problème utiliser le shortcode manuellement (cf <a href="http://geo.wp.cephee.fr"> http://geo.wp.cephee.fr </a>).
	<p> <b>Sélectionner </b> une carte existante :
		<select name="geomap_maps" id="geomap_maps" style="width:200px;" />
<?php
		$maps_results = WP_GEOPORTAL_get_all_maps();
		foreach($maps_results as $result)
		{
?>
			<option value="<?php echo($result->id) ?>" > <?php echo($result->name .' ('. $result->id .')' ) ?> </option>
<?php
		}
?>               	
		</select>
		<input type="button" id="map_bd_button" value="Envoyer la carte à l'éditeur" onclick="WP_GEO_send_shortcode_directly();" />
		ou
		<input type="button" id="map_bd_button" value="Modifier la carte" onclick="WP_GEO_selected_map();" />
	</p>
	<p>
		<b>Créer</b> une nouvelle carte :
		<input type="button" id="map_new_button" value="<?php _e('Nouvelle carte') ?>" onclick="WP_GEO_new_map();" />
	</p>
</div>
<div id="form_builder_div" style="display:none;">
<?php
	}
	else //admin
	{
?>
	
		<form id="myForm" method="post" onsubmit="return WP_GEO_on_submit_form();">
		<input type="hidden" name="submit_hidden" value="Y" />
		
<?php
	}
?>	
		<center>
			<table width="100%">
				<tr valign="top" align="left" >
<?php
	if($form_type == "Admin")
	{
?>
					<th width="200" scope="row">Clé API :</th>
					<td>
						<input name="geomap_key" id="geomap_key"
							 type="text"
							 id="geomap_key"
							 value="<?php echo get_option('geomap_key'); ?>"
							 style="width:200px;" />
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="200" scope="row">Version de l'API :</th>
					<td>
						<select name="geomap_apiVersion" id="geomap_apiVersion" style="width:80px;" />
							<option value="2.0.0" <?php echo(get_option('geomap_apiVersion')=='2.0.0'?'selected':'') ?> >
								2.0.0
							</option>
							<option value="latest" <?php echo(get_option('geomap_apiVersion')=='latest'?'selected':'') ?> >
								latest
							</option>
						</select>
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="200" scope="row"> Activer "Shortcode Builder" :</th>
					<td>
							<input name="geomap_builder"
							 type="checkbox"
							 id="geomap_builder"
							 <?php if (get_option('geomap_builder') == 'on') echo 'checked'; ?>
							 style="width:50px;" />
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="200" scope="row"> Activer le profil altimétrique : </th>
					<td>
							<input name="geomap_graph"
							 type="checkbox"
							 id="geomap_graph"
							 <?php if (get_option('geomap_graph') == 'on') echo 'checked'; ?>
							 style="width:50px;" /> (utilise jQuery et jQuery.flot)
					</td>
				</tr>
			</table>
		</center>
		<h3>Paramètres de la carte par défaut</h3>
		<center>
			<table width="100%">
<?php
	}
	else
	{
?>			
				<tr valign="top" align="left" >
					<th width="200" scope="row">Nom de la carte:</th>
					<td>
						<input name="geomap_map_name"
							 type="text"
							 id="geomap_map_name"
							 style="width:200px;" onchange="WP_GEO_on_change_setting()" />
					</td>
				</tr>
<?php
	}
?>	
        <tr valign="top" align="left" >
          <th width="200" scope="row">Territoire :</th>
					<td>
               	<select name="geomap_territory" id="geomap_territory" style="width:200px;" onchange="WP_GEO_on_change_setting()"/>
		               <option value="FXX" <?php echo(get_option('geomap_territory')=='FXX'?'selected':'') ?> >
		                  France métropolitaine
		               </option>
		               <option value="GLP" <?php echo(get_option('geomap_territory')=='GLP'?'selected':'') ?> >
		                  Guadeloupe
		               </option>
							<option value="GUF" <?php echo(get_option('geomap_territory')=='GUF'?'selected':'') ?> >
		                  Guyane
		               </option>
							<option value="MTQ" <?php echo(get_option('geomap_territory')=='MTQ'?'selected':'') ?> >
		                  Martinique
		               </option>
							<option value="MYT" <?php echo(get_option('geomap_territory')=='MYT'?'selected':'') ?> >
		                  Mayotte
		               </option>
							<option value="NCL" <?php echo(get_option('geomap_territory')=='NCL'?'selected':'') ?> >
		                  Nouvelle Calédonie
		               </option>
		               <option value="PYF" <?php echo(get_option('geomap_territory')=='PYF'?'selected':'') ?> >
		                  Polynésie Française
		               </option>
		               <option value="REU" <?php echo(get_option('geomap_territory')=='REU'?'selected':'') ?> >
		                  Réunion
		               </option>
		               <option value="SPM" <?php echo(get_option('geomap_territory')=='SPM'?'selected':'') ?> >
		                  Saint Pierre et Miquelon
		               </option>
		               <option value="WLF" <?php echo(get_option('geomap_territory')=='WLF'?'selected':'') ?> >
		                  Wallis et Futuna
		               </option>
                	</select>
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="50" scope="row">Lat / Lon :</th>
					<td> 
						<input name="geomap_lat"
								 type="number"
								 step="any"
								 id="geomap_lat"
								 value="<?php echo get_option('geomap_lat'); ?>"
								 style="width:50px;"
								 onchange="WP_GEO_on_change_setting()" />
/
						<input name="geomap_lon"
								 type="number"
								 step="any"
								 id="geomap_lon"
								 value="<?php echo get_option('geomap_lon'); ?>"
								 style="width:50px;"
								 onchange="WP_GEO_on_change_setting()" />
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="200" scope="row">Niveau de Zoom:</th>
					<td>
						<input name="geomap_z"
							 type="number"
							 min="0" max="21" step="1"
							 id="geomap_z"
							 value="<?php echo get_option('geomap_z'); ?>"
							 style="width:50px;"
							 onchange="WP_GEO_on_change_setting()" />
De 0 (monde) à 21 (maison).
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="50" scope="row">Largeur / Hauteur de la carte :</th>
					<td>
						<input name="geomap_w"
							 type="number"
							 id="geomap_w"
							 value="<?php echo get_option('geomap_w'); ?>"
							 style="width:50px;"
							 onchange="WP_GEO_on_change_setting()" />
/
						<input name="geomap_h"
							 type="number"
							 id="geomap_h"
							 value="<?php echo get_option('geomap_h'); ?>"
							 style="width:50px;"
							 onchange="WP_GEO_on_change_setting()" />
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="200" scope="row">Type d'affichage :</th>
					<td>

						<input type="radio"
							name="geomap_type"
							id="geomap_type"
							value="normal" <?php if ($type == 'normal') echo 'checked'; ?>
							onchange="WP_GEO_on_change_setting()" >
							<b>Normal</b> : affichage complet, avec tous les outils.
						<br />
						<input type="radio"
							name="geomap_type"
							id="geomap_type"
							value="mini" <?php if ($type == 'mini') echo 'checked'; ?>
							onchange="WP_GEO_on_change_setting()" >
							<b>Mini</b> : affichage minimaliste, sans outils.
						<br />
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="200" scope="row">Paramètres des couches :</th>
					<td>
						<div id="no_api_key" > <p> Merci de renseigner une clé valide, puis de "Sauver les changements" afin d'obtenir la liste des couches disponibles.
						Si le problème persiste, cliquer <a href="javascript:WP_GEO_active_form(LAYERS_ARRAY);"> ici</a>.</div>
						<div id="layer_simple"  style="display:none">
						<p><b> Mode Simple </b>: Cliquer <a href="javascript:WP_GEO_switch_mode();"> ici</a> pour voir toutes les couches disponibles.
						</p>
								<table class="simpleTable" id="simpleTable">
								<thead>
									<tr>
										<th>Activer</th>
										<th>Nom de la couche</th>
										<th>Visibilité</th>
										<th>Opacité</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
						<div id="layer_avanced" style="display:none">
							<p> <b> Mode Avancé </b>: toutes les couches autorisées par votre contrat : <br/>
							Cliquer <a href="javascript:WP_GEO_switch_mode();"> ici</a> pour revenir au mode simple.
							La description de chacune des couches est disponible <a href="https://api.ign.fr/geoportail/api/doc/fr/webmaster/layers.html" target="_blank"> ici</a>.
							</p>
								<table class="avancedTable" id="avancedTable">
								<thead>
									<tr>
										<th>Activer</th>
										<th>Nom de la couche</th>
										<th>Visibilité</th>
										<th>Opacité</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
					</td>
				</tr>
<?php
	if($form_type == "Builder")
	{
?>
				<tr valign="top" align="left" >
					<th width="200" scope="row">Ajouter un fichier GPX :</th>
					<td>
						Nom de la couche :
						<input name="geomap_gpx_title"
							 type="text"
							 id="geomap_gpx_title"
							 style="width:100px;"
							 onchange="WP_GEO_on_change_setting()" />
						url :
						<input name="geomap_gpx_url"
							 type="text"
							 id="geomap_gpx_url"
							 style="width:250px;"
							 onchange="WP_GEO_on_change_setting()" />
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="200" scope="row"> Activer le profil altimétrique : </th>
					<td>
							<input name="geomap_graph"
							 type="checkbox"
							 id="geomap_graph"
							 style="width:50px;"
							 onchange="WP_GEO_on_change_setting()" />
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="200" scope="row">Ajouter un fichier KML :</th>
					<td>
						Nom de la couche :
						<input name="geomap_kml_title"
							 type="text"
							 id="geomap_kml_title"
							 style="width:100px;"
							 onchange="WP_GEO_on_change_setting()" />
						url :
						<input name="geomap_kml_url"
							 type="text"
							 id="geomap_kml_url"
							 style="width:250px;"
							 onchange="WP_GEO_on_change_setting()" />
					</td>
				</tr>
				<tr valign="top" align="left" >
					<th width="200" scope="row"> Activer la géolocalisation : </th>
					<td>
							<input name="geomap_geolocate"
							 type="checkbox"
							 id="geomap_geolocate"
							 style="width:50px;"
							 onchange="WP_GEO_on_change_setting()" />
					</td>
				</tr>
<?php
	}
?>
			</table>
		</center>

		<p>
<?php
	if($form_type == "Builder")
	{
?>
			<input type="button" id="map_button" value="Afficher la carte" onclick="WP_GEO_show_map();" />
			<input type="button" value="Sauvegarder et Envoyer à l'éditeur" onclick="WP_GEO_send_shortcode();" />
			<input type="button" value="Fermer" onclick="WP_GEO_close_form_builder_div();" />
			
<?php
	}
	else
	{
?>
		<input type="button" id="map_button" value="Afficher la carte" onclick="WP_GEO_show_map_admin();" />
<?php
	}
?>
		</p>
	Pour rafraichir la carte, effacer puis afficher la carte de nouveau.
	</div>
<?php
	if($form_type == "Admin")
	{
?>
	<div id="map_bd_admin">
	<div id='geomap_message_admin' class='updated below-h2' style="display:none;">  </div>
		<h3> Gestion des cartes enregistrées </h3>
			<p> <b>Supprimer une carte enregistrée </b> :
		<select name="geomap_maps" id="geomap_maps" style="width:200px;" />
<?php
		$maps_results = WP_GEOPORTAL_get_all_maps();
		foreach($maps_results as $result)
		{
			if($result->id != 1)
			{
?>
			<option value="<?php echo($result->id) ?>" > <?php echo($result->name .' ('. $result->id .')' )  ?> </option>
<?php
			}
		}
?>               	
		</select>
		<input type="button" id="map_bd_button" value="<?php _e('Remove map') ?>" onclick="WP_GEO_remove_map_admin();" />
		</p>
	</div>
<?php
	}
?>
	<div id="map_previous" style="display:none;"> </div>
	<script language="javascript">
		//var LAYERS_ARRAY = "<?php echo get_option('geomap_layers_array') ?>";
		window.onload= function(){
			WP_GEO_active_form("<?php echo get_option('geomap_layers_array') ?>");
		};
	</script>
<?php
}

?>
