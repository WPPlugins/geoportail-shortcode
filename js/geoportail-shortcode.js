/******************************************************************************\
*	geoportail-shortcode.js
*	Project : Geoportail-Shortcode
*	Date    : 08/12
*	Auteur  : geoWP
*   comment : concatenation de Ajax.js / Chart.js / Form-Builder.js / Maps.js
\******************************************************************************/

window.onload= WP_GEO_load_API();

var WP_GEO_config = [];
//Chart
WP_GEO_config.plots_tab                 = [];
//Form-Builder
WP_GEO_config.mode                      = "simple";
WP_GEO_config.layers_allowed            = null;
WP_GEO_config.nb_simple_layers			= 0;
WP_GEO_config.layers_activate			= [];
WP_GEO_config.ortho_name				= "Ortho Images";
WP_GEO_config.map_name					= "IGN Maps";
WP_GEO_config.show_map_statut           = 0;
WP_GEO_config.show_param_statut         = 0;
WP_GEO_config.id_current_map			= -1;
WP_GEO_config.is_current_map_save       = false;
//Maps
WP_GEO_config.param_list                = [];
WP_GEO_config.pt_cur                    = null;
WP_GEO_config.layer_cur					= null;
WP_GEO_config.viewers_tab				= [];
WP_GEO_config.mouse_pos					= [];
//
WP_GEO_config.API_Load_Clbk				= null;

/****************************************************************************************************************************\
*	Ajax.js
*	Project : Geoportail-Shortcode
*	Date    : 08/12
*	Auteur  : geoWP
\*****************************************************************************************************************************/

/*----------------------------------------------------------------------------*\
* function get_gpx
\*----------------------------------------------------------------------------*/
function WP_GEO_get_gpx(gpx,id,plot_graph)
{
	jQuery.post(
			ajaxurl,
			{'action':'get_gpx','url': gpx.url},
			function(response)
			{
					WP_GEO_on_get_gpx_reponse(response,gpx,id,plot_graph);
			}
	);
}
/*----------------------------------------------------------------------------*\
* function onGetMapReponse
\*----------------------------------------------------------------------------*/
function WP_GEO_on_get_gpx_reponse(gpxJSON,gpx,id,plot_graph)
{
	if(gpxJSON !== 0)
	{
		// Out : maps, graph, waypoints 
		//var gpxTemp = eval('(' + gpxJSON + ')');
        var gpxTemp = JSON.parse(gpxJSON);
	
		gpx.maps = gpxTemp.maps;
		gpx.waypoints = gpxTemp.waypoints;
	
		WP_GEO_add_gpx(gpx,id,plot_graph);
		
		if(plot_graph == 'true')
			WP_GEO_WP_GEO_add_data_to_chart(id,gpxTemp.graph,gpx.name);
	}
	else
		alert("ERROR : WP_GEO_on_get_gpx_reponse");
}
/*----------------------------------------------------------------------------*\
* function selectedMap
\*----------------------------------------------------------------------------*/
function WP_GEO_selected_map()
{
	var id = document.getElementById("geomap_maps").value;
	WP_GEO_display_message("En attente de la carte "+id);
	
	jQuery.post(
			ajaxurl,
			{'action':'get_map','id': id},
			function(response)
			{
				if(response !=="")
					WP_GEO_on_selected_map_reponse(response);
			}
	);
}
/*----------------------------------------------------------------------------*\
* function onGetMapReponse
\*----------------------------------------------------------------------------*/
function WP_GEO_on_selected_map_reponse(mapJSON)
{
	//var map = eval('(' + mapJSON + ')');

    var map = JSON.parse(mapJSON);
	var id = map.id;
	var name = map.name;
	var paramsJSON = map.data;
	var time = map.time;
	
	var params = JSON.parse(paramsJSON); 

	WP_GEO_set_html_from_params(params);

	document.getElementById("geomap_map_name").value = name;
	
	if(WP_GEO_config.show_param_statut===0){
		jQuery("#map_bd_builder").fadeOut(500);
		jQuery("#form_builder_div").fadeIn(500);
		WP_GEO_config.show_param_statut =1;
	}
	
	WP_GEO_config.id_current_map			= id;
	WP_GEO_config.is_current_map_save		= true;
	
	WP_GEO_display_message("Carte " + id +" chargée.");
}
/*----------------------------------------------------------------------------*\
* function removeMapAdmin
\*----------------------------------------------------------------------------*/
function WP_GEO_remove_map_admin()
{
	var id = document.getElementById("geomap_maps").value;

	jQuery.post(
			ajaxurl,
			{'action':'remove_map','id': id},
			function(response)
			{
				if(response !=="")
					WP_GEO_on_remove_map_admin_reponse(response,id);
			}
	);

}
/*----------------------------------------------------------------------------*\
* function onremoveMapAdminReponse
\*----------------------------------------------------------------------------*/
function WP_GEO_on_remove_map_admin_reponse(response,id)
{
	if(response !== "")
	{
		WP_GEO_display_message_admin("Carte " + id +" supprimée.");
		var elSel = document.getElementById('geomap_maps');
		
		for (var i = elSel.length - 1; i>=0; i--)
			if (elSel.options[i].value == id)
				elSel.remove(i);
	}
}
/*----------------------------------------------------------------------------*\
* function saveMap
\*----------------------------------------------------------------------------*/
function WP_GEO_save_map()
{

	var params = WP_GEO_get_params_from_html();
	
	params.id = 1;

	var JSON_params = JSON.stringify(params);
	
	var name = document.getElementById("geomap_map_name").value;
	
	jQuery.post(
			ajaxurl,
			{
				'action':'save_map',
				'data':JSON_params,
				'name':name
			},
			function(response)
			{
					WP_GEO_on_save_map_reponse(response,name);
			}
	);
}
/*----------------------------------------------------------------------------*\
* function onSaveMapReponse
\*----------------------------------------------------------------------------*/
function WP_GEO_on_save_map_reponse(id,name,send_shortcode)
{
	send_shortcode = typeof send_shortcode !== 'undefined' ? send_shortcode : false;
	
	//On ajout l'id de la nouvelle carte
	var elOptNew = document.createElement('option');
	elOptNew.value = id;
	elOptNew.text = name + " ("+id+")";
	var elSel = document.getElementById('geomap_maps');

	try {
		elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
	}
	catch(ex) {
		elSel.add(elOptNew); // IE only
	}
	elSel.selectedIndex = elSel.length -1;
	
	WP_GEO_config.id_current_map			= id;
	WP_GEO_config.is_current_map_save		= true;
	
	if(send_shortcode)
	{
		WP_GEO_send_shortcode();
		WP_GEO_display_message("Carte " + id +" enregistée dans la base de données et envoyée à l'éditeur.");
	}
	else
		WP_GEO_display_message("Carte " + id +" enregistée dans la base de données.");
}
/*----------------------------------------------------------------------------*\
* function save_and_send_shortcode
\*----------------------------------------------------------------------------*/
function WP_GEO_save_and_send_shortcode()
{

	var params = WP_GEO_get_params_from_html();
	params.id = 1;

	var JSON_params = JSON.stringify(params);
	var name = document.getElementById("geomap_map_name").value;
		
	jQuery.post(
			ajaxurl,
			{
				'action':'save_map',
				'data':JSON_params,
				'name':name
			},
			function(response)
			{
					WP_GEO_on_save_map_reponse(response,name,true);
			}
	);
}
/*----------------------------------------------------------------------------*\
* function updateMap
\*----------------------------------------------------------------------------*/
function WP_GEO_update_map()
{
	
	var params = WP_GEO_get_params_from_html();
	
	params.id = 1;

	var JSON_params = JSON.stringify(params);
	var name = document.getElementById("geomap_map_name").value;

	jQuery.post(
			ajaxurl,
			{
				'action':'update_map',
				'data':JSON_params,
				'name':name,
				'id':id
			},
			function(response)
			{
				if(response !== "")
					WP_GEO_display_message("Carte " + id +" modifiée dans la base de données");
				else
					WP_GEO_display_message("Erreur lors de la modification de la carte "+id);
			}
	);
}
/*----------------------------------------------------------------------------*\
* function updateMap
\*----------------------------------------------------------------------------*/
function WP_GEO_update_and_send_shortcode()
{

	var params = WP_GEO_get_params_from_html();
	params.id = 1;

	var JSON_params = JSON.stringify(params);
	var name = document.getElementById("geomap_map_name").value;
	var id = WP_GEO_config.id_current_map;

	jQuery.post(
			ajaxurl,
			{
				'action':'update_map',
				'data':JSON_params,
				'name':name,
				'id':id
			},
			function(response)
			{
				if(response !== "")
				{
					WP_GEO_config.is_current_map_save = true;
					WP_GEO_display_message("Carte " + id +" modifiée dans la base de données et envoyée à l'éditeur");
					WP_GEO_send_shortcode();
				}
				else
					WP_GEO_display_message("Erreur lors de la modification de la carte "+id);
			}
	);
}
/*----------------------------------------------------------------------------*\
* function get_and_display_map
\*----------------------------------------------------------------------------*/
function WP_GEO_get_and_display_map(id_map,id_div)
{

	jQuery.post(
			ajaxurl,
			{'action':'get_map','id': id_map},
			function(response)
			{
				if(response !== "")
					WP_GEO_on_get_and_display_map_reponse(response,id_div);
			}
	);
}
/*----------------------------------------------------------------------------*\
* function on_get_and_display_map_reponse
\*----------------------------------------------------------------------------*/
function WP_GEO_on_get_and_display_map_reponse(mapJSON,id_div)
{
	//var map = eval('(' + mapJSON + ')'); 
    var map = JSON.parse(mapJSON);
	//var id = map["id"];
	//var name = map["name"];
	var paramsJSON = map.data;
	//var time = map["time"];
	
	var params = JSON.parse(paramsJSON); 
	params.id = id_div;
	
	WP_GEO_create_map(params);

	if(params.graph == 'true')
		WP_GEO_create_chart_from_id(id_div);

	
}
/****************************************************************************************************************************\
*	Chart.js
*	Project : Geoportail-Shortcode
*	Date : 10/05/12
*	Auteur : geoWP
/****************************************************************************************************************************/


/*----------------------------------------------------------------------------*\
* function myTicksFormaterX
\*----------------------------------------------------------------------------*/
function WP_GEO_ticks_formaterX(val, axis) {
	if (val > 1000)
		return (val / 1000).toFixed(axis.tickDecimals) + " km";
	else
		return val.toFixed(axis.tickDecimals) + " m";
}
/*----------------------------------------------------------------------------*\
* function myTicksFormaterY
\*----------------------------------------------------------------------------*/
function WP_GEO_ticks_formaterY(val, axis) {
	return val.toFixed(axis.tickDecimals) + " m";
}
/*----------------------------------------------------------------------------*\
* function myTicksFormaterYSpeed
\*----------------------------------------------------------------------------*/
function WP_GEO_ticks_formaterYSpeed(val, axis) {
	return val.toFixed(axis.tickDecimals) + " km/h";
}
/*----------------------------------------------------------------------------*\
* function add_data_to_chart
\*----------------------------------------------------------------------------*/
function WP_GEO_WP_GEO_add_data_to_chart(id,data,name)
{

	cont = WP_GEO_config.plots_tab[id];
	// Les données a ploter
	//plot.data_chart = [];
	//plot.data_chart_speed = [];

	//var data_t = data.data;
	var data_temp = [];
	var data_speed_temp = [];

	for(j=0; j<data.dist.length; j++)
	{
		data_temp.push([
				data.dist[j],
				data.ele[j]
			]);
		data_speed_temp.push([
				data.dist[j],
				data.speed[j]
			]);
	}
	cont.data_chart.push(
		{
			data: data_temp,
			label: name
		}
	);
	cont.data_chart_speed.push(
		{
			data: data_speed_temp,
			label: name
		}
	);
	
	cont.plot.setData(cont.data_chart);
	cont.plot.setupGrid();
	cont.plot.draw();
	
	cont.plot_speed.setData(cont.data_chart_speed);
	cont.plot_speed.setupGrid();
	cont.plot_speed.draw();
}
/*----------------------------------------------------------------------------*\
* function create_chart
\*----------------------------------------------------------------------------*/
function WP_GEO_create_chart_from_id(id)
{

	var cont = [];
	
	jQuery("#plot_"+id).show();
	jQuery("#plot_"+id+"_speed").show();

	// la div contenant le plot
	cont.placeholder = jQuery("#plot_"+id);
	cont.placeholder_speed = jQuery("#plot_"+id+"_speed");
	
	// les options du plot
	cont.options = {
		xaxis: { show: true, ticks: 5, tickFormatter: WP_GEO_ticks_formaterX },
		yaxis: { show: true, ticks: 3, tickFormatter: WP_GEO_ticks_formaterY },
		series: { lines: { show: true } },
		grid: { 
			hoverable: true,
			autoHighlight: true
		},
		crosshair: { mode: "x" },
		legend: { show: false}

	};
	// les options du plot speed
	cont.options_speed = {
		xaxis: { show: true, ticks: 5, tickFormatter: WP_GEO_ticks_formaterX },
		yaxis: { show: true, ticks: 3, tickFormatter: WP_GEO_ticks_formaterYSpeed },
		series: { lines: { show: true } },
		grid: { 
			hoverable: true,
			autoHighlight: true
		},
		crosshair: { mode: "x" },
		legend: { show: false}

	};

	// Les données a ploter
	cont.data_chart = [];
	cont.data_chart_speed = [];
	
	// Le plot	
	jQuery(function () {
		//WP_GEO_config["plots_tab"][params.id] = jQuery.plot(placeholder, data_chart, options);
		cont.plot = jQuery.plot(cont.placeholder, cont.data_chart, cont.options);
		//WP_GEO_config["plots_tab"][params.id+"_speed"] = jQuery.plot(placeholder_speed, data_chart_speed, options);
		cont.plot_speed = jQuery.plot(cont.placeholder_speed, cont.data_chart_speed, cont.options_speed);
        });
  // Fonction "hover"
  cont.placeholder.bind("plothover", function (event, pos, item) {
        WP_GEO_on_plot_hover(event, pos, item, id,"");
    });
    // Fonction "hover"
  cont.placeholder_speed.bind("plothover", function (event, pos, item) {
        WP_GEO_on_plot_hover(event, pos, item, id,"_speed");
    });
  
  WP_GEO_config.plots_tab[id] = cont;
  
}
/*----------------------------------------------------------------------------*\
* function create_chart
\*----------------------------------------------------------------------------*/
function WP_GEO_create_chart(params)
{

	WP_GEO_create_chart_from_id(params.id);
	for(i=0; i<params.data_array.length; i++)
	{
		var data_t = params.data_array[i].data;
		WP_GEO_WP_GEO_add_data_to_chart(params.id,data_t,params.name);
	}

}
/*----------------------------------------------------------------------------*\
* function onPlotHover
\*----------------------------------------------------------------------------*/
function WP_GEO_on_plot_hover(event, pos, item, plot_id,type)
{
	var plot;
	
	if(type === "")
		plot = WP_GEO_config.plots_tab[plot_id].plot;
	else
		plot = WP_GEO_config.plots_tab[plot_id].plot_speed;

	var dataset = plot.getData();
    var z=0,
        d=0;
	
	if(dataset.length==1)
	{// s'il y a qu'une seule courbe :
        // on utilise l'intersection  du crosshair avec la courbe
        var axes = plot.getAxes();
        if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
            pos.y < axes.yaxis.min || pos.y > axes.yaxis.max)
            return;
    
        var series = dataset[0];
    
        // find the nearest points, x-wise
        for (j = 0; j < series.data.length; ++j)
            if (series.data[j][0] > pos.x)
                break;
        
        // now interpolate
        var p1 = series.data[j - 1], p2 = series.data[j];
        if (p1 === null)
            z = p2[1];
        else if (p2 === null)
            z = p1[1];
        else
            z = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
        // on recalcul la position de la popup pour qu'elle suive la courbe
        var height = jQuery("#plot_"+plot_id).height();
        var pageX = pos.pageX;
        var pageY = pos.pageY + (pos.y - z) * height / (axes.yaxis.max - axes.yaxis.min );
        
        // d et z sont tronqués
        d = (pos.x/1000).toFixed(0);
        z = z.toFixed(0); 
        // on affiche le popup et le point correspondant sur la carte 
        WP_GEO_show_tooltip(pageX, pageY,z,d,type);
        WP_GEO_display_point(j,series.label,plot_id);
	}
	else
	{ // s'il y a plusieurs graph :
		if (item)//on réagit que si le curseur est sur la courbe
		{
			if (previousPoint != item.dataIndex)
			{
				previousPoint = item.dataIndex;
                
				d = (pos.x/1000).toFixed(0);
				z = pos.y.toFixed(0);
				
				// on affiche le popup et le point correspondant sur la carte 
				WP_GEO_show_tooltip(item.pageX, item.pageY,z,d,type);
				WP_GEO_display_point(item.dataIndex,item.series.label,plot_id);
			}
		}
		else
		{
			jQuery("#tooltip").remove();
			previousPoint = null;            
		}
	}
}
/*----------------------------------------------------------------------------*\
* function showTooltip
\*----------------------------------------------------------------------------*/
function WP_GEO_show_tooltip(x,y,z,d,type)
{		
	WP_GEO_remove_tooltip();
	var contents;
	if(type === "")
	{
		contents ="<table>"
        +"<tr><th style='font-weight:bold;text-align:right;width=50px'> Distance : </th>"
		+"<td style='text-align:right;width=50px'> &nbsp; "+d+" km </td> </tr>"
		+"<tr><th style='font-weight:bold;text-align:right;width=50px'> Altitude : </th>"
		+"<td style='text-align:right;width=50px'> &nbsp; "+z+"  m </td></tr>"
		+"</table>";
	} else
	{
		contents ="<table>"
                  +"<tr><th style='font-weight:bold;text-align:right;width=50px'> Distance : </th>"
                  +"<td style='text-align:right;width=50px'> &nbsp; "+d+" km </td> </tr>"
                  +"<tr><th style='font-weight:bold;text-align:right;width=50px'> Vitesse : </th>"
                  +"<td style='text-align:right;width=50px'> &nbsp; "+z+"  km/h </td></tr>"
                  +"</table>";
	}
		
	jQuery('<div id="tooltip">' + contents + '</div>').css( {
        position: 'absolute',
		display: 'none',
		'z-index': 10000,
		top: y + 5,
		left: x + 5,
		border: '1px solid #fdd',
		padding: '2px',
		'background-color': '#fee',
		opacity: 0.80
	}).appendTo("body").fadeIn(200);
	// jQuery("#tooltip").css('z-index')=1000;
}
/*----------------------------------------------------------------------------*\
* function removeTooltip
\*----------------------------------------------------------------------------*/
function WP_GEO_remove_tooltip()
{
	jQuery("#tooltip").remove();
}
/*----------------------------------------------------------------------------*\
* function removeCorsshair
\*----------------------------------------------------------------------------*/
function WP_GEO_remove_corsshair(viewer_id)
{
	var plot = WP_GEO_config.plots_tab[viewer_id].plot;
	
	plot.clearCrosshair();
}
/*----------------------------------------------------------------------------*\
* function displayPointChart
* affiche une requete venant de openlayers
\*----------------------------------------------------------------------------*/
function WP_GEO_display_point_chart(pt_id,layer_name,viewer_id,x,y)
{
	var plot = WP_GEO_config.plots_tab[viewer_id].plot;
	
	var dataset = plot.getData();

	var data;
	for( i in dataset)
	{
		if(dataset[i].label == layer_name)
			break;
	}
	data = dataset[i];
	var d_brute = data.data[pt_id][0];
	var d = (d_brute/1000).toFixed(0);
	var z = data.data[pt_id][1].toFixed(0);
	var position = jQuery("#map_"+viewer_id).offset();
    //var width = jQuery("#plot_"+viewer_id).width()
    // affiche Tooltip sur la carte
	WP_GEO_show_tooltip(position.left+x+10,position.top+y+10,z,d,"");
	//
	//var axes = plot.getAxes();
	var pos =[];
	pos.x = d_brute;//((d_brute - axes.xaxis.min)*width/axes.xaxis.max).toFixed(0);
	pos.y = 50;

	plot.setCrosshair(pos);
}

/****************************************************************************************************************************\
*	Form-Builder.js
*	Project : Geoportail-Shortcode
*	Date : 10/05/12
*	Auteur : geoWP
/****************************************************************************************************************************/

/*----------------------------------------------------------------------------*\
* function show_map_admin
\*----------------------------------------------------------------------------*/
function WP_GEO_show_map_admin()
{
	WP_GEO_show_map(WP_GEO_get_params_from_html(true));
}
/*----------------------------------------------------------------------------*\
* function show_map
\*----------------------------------------------------------------------------*/
function WP_GEO_show_map(params)
{

	if(typeof params === 'undefined')
		params = WP_GEO_get_params_from_html();
	
	if(WP_GEO_config.show_map_statut === 0)
	{
		jQuery("#form_builder_div").append("<div id='map_prev' style='display:none;'> </div>");
		jQuery("#map_prev").css({  
			"height": params.h,
			"width" : params.w
		});
		jQuery("#map_button").attr('value','Cacher la carte');
		
		if(params.graph == 'true')
		{
			jQuery("#form_builder_div").append("<div id='plot_prev' style='display:none;'> </div>");
			jQuery("#plot_prev").css({  
				"height": "250px",
				"width" : params.w
			});
			
			jQuery("#form_builder_div").append("<div id='plot_prev_speed' style='display:none;'> </div>");
			jQuery("#plot_prev_speed").css({  
				"height": "250px",
				"width" : params.w
			});
		}
		
		WP_GEO_config.show_map_statut = 1;
		WP_GEO_create_map(params);
		
		if(params.graph == 'true')
			WP_GEO_create_chart_from_id(params.id);
			
		jQuery("#map_prev").fadeIn(1000);
		
		if(params.graph == 'true')
		{
			jQuery("#plot_prev").fadeIn(1000);
			jQuery("#plot_prev_speed").fadeIn(1000);
		}
	}
	else
	{
		jQuery("#map_prev").fadeOut(1000, function() { jQuery(this).remove(); });
		jQuery("#plot_prev").fadeOut(1000, function() { jQuery(this).remove(); });
		jQuery("#plot_prev_speed").fadeOut(1000, function() { jQuery(this).remove(); });
		
		jQuery("#map_button").attr('value','Afficher la carte');
		WP_GEO_config.show_map_statut = 0;
		WP_GEO_delete_map(params.id);
	}
}
/*----------------------------------------------------------------------------*\
* function active_form
\*----------------------------------------------------------------------------*/
function WP_GEO_active_form(LAYERS_ARRAY)
{
	WP_GEO_config.active_form_bis = LAYERS_ARRAY;
	WP_GEO_config.API_Load_Clbk = WP_GEO_active_form_bis;
	
	if(typeof(gGEOPORTALRIGHTSMANAGEMENT) == 'undefined' || WP_GEO_config.layers_allowed === null)
		WP_GEO_load_API();
	else	
		WP_GEO_active_form_bis();
}
/*----------------------------------------------------------------------------*/
function WP_GEO_active_form_bis()
{

	if(typeof(gGEOPORTALRIGHTSMANAGEMENT) == 'undefined' || WP_GEO_config.layers_allowed === null)
		WP_GEO_load_API();

	LAYERS_ARRAY = WP_GEO_config.active_form_bis;
	LAYERS_ARRAY = LAYERS_ARRAY.split(/;/);
	LAYERS_ARRAY.pop(); // supprime la derniere case vide

	for (i=0; i<LAYERS_ARRAY.length; i++)
	{
		temp=LAYERS_ARRAY[i].split('|');
		WP_GEO_config.layers_activate.push( temp[0] );
		WP_GEO_config.layers_activate[ temp[0] ] = [];
		WP_GEO_config.layers_activate[ temp[0] ].push( temp[1]);
		WP_GEO_config.layers_activate[ temp[0] ].push( temp[2]);
	}
	
	var avancedTable = document.getElementById("avancedTable");
	var simpleTable = document.getElementById("simpleTable");
	for(i=0;i<WP_GEO_config.layers_allowed.length;++i)
	{
		//var current_layer = new String(WP_GEO_config["layers_allowed"][i]);
		var current_layer = WP_GEO_config.layers_allowed[i];
        // on test si c'est bien une couche valide
		if( (current_layer.indexOf("WMSC")!= -1) || (current_layer.indexOf("WMTS")!= -1) )
		{
			WP_GEO_add_ligne(current_layer,i,avancedTable);
	
			if( (current_layer == "GEOGRAPHICALGRIDSYSTEMS.MAPS:WMSC") || 
                (current_layer == "GEOGRAPHICALGRIDSYSTEMS.MAPS:WMTS") )
			{
				WP_GEO_add_ligne(WP_GEO_config.map_name,"s_"+WP_GEO_config.nb_simple_layers,simpleTable);
				WP_GEO_config.nb_simple_layers++;
			}
		
			if( (current_layer == "ORTHOIMAGERY.ORTHOPHOTOS:WMSC") ||
				(current_layer == "ORTHOIMAGERY.ORTHOPHOTOS:WMTS") )
			{
				WP_GEO_add_ligne(WP_GEO_config.ortho_name,"s_"+WP_GEO_config.nb_simple_layers,simpleTable);
				WP_GEO_config.nb_simple_layers++;
			}
		}
	}
	if(WP_GEO_config.layers_allowed.length!==0)
	{
		WP_GEO_visibilite("no_api_key");
		WP_GEO_visibilite("layer_simple");
	}
}
/*----------------------------------------------------------------------------*\
* function WP_GEO_send_shortcode_directly
\*----------------------------------------------------------------------------*/
function WP_GEO_send_shortcode_directly()
{
    var id = document.getElementById("geomap_maps").value;
    var code = '[geoportail id_map="'+ id +'" ]';
	send_to_editor(code);
	WP_GEO_display_message("Carte "+ id +" envoyée à l'éditeur.");
	if( 1 == WP_GEO_config.show_param_statut )
	{
		jQuery("#map_bd_builder").fadeIn(500);
		jQuery("#form_builder_div").fadeOut(500);
		WP_GEO_config.show_param_statut = 0;
	}
}
/*----------------------------------------------------------------------------*\
* function send_shortcode
\*----------------------------------------------------------------------------*/
function WP_GEO_send_shortcode()
{
	if(	(    -1 != WP_GEO_config.id_current_map)  &&
			( true	=== WP_GEO_config.is_current_map_save) )
	{
		var code = '[geoportail id_map="'+ WP_GEO_config.id_current_map +'" ]';
		send_to_editor(code);
		WP_GEO_display_message("Carte "+WP_GEO_config.id_current_map+" envoyée à l'éditeur.");
		if( 1 == WP_GEO_config.show_param_statut )
		{
			jQuery("#map_bd_builder").fadeIn(500);
			jQuery("#form_builder_div").fadeOut(500);
			WP_GEO_config.show_param_statut = 0;
		}
	}
	else
	{
		if(-1 == WP_GEO_config.id_current_map)
		{
			WP_GEO_display_message("La carte n'est pas enregistrée dans la base de donnée : <a href='javascript:WP_GEO_save_and_send_shortcode();'> Enregistrer et envoyer </a> à l'éditeur.");
		}
		else
		{
			WP_GEO_display_message("La carte existe bien dans la base de donnée mais elle a été modifiée : <a href='javascript:WP_GEO_save_and_send_shortcode();'> Enregistrer une nouvelle version et envoyer </a> à l'éditeur, ou <a href='javascript:WP_GEO_update_and_send_shortcode();'> Modifier la version existante et envoyer </a> à l'éditeur.");
			}
	}
}
/*----------------------------------------------------------------------------*\
* function close_form_builder_div
\*----------------------------------------------------------------------------*/
function WP_GEO_close_form_builder_div()
{
    if( 1 == WP_GEO_config.show_param_statut )
    {
        jQuery("#map_bd_builder").fadeIn(500);
        jQuery("#form_builder_div").fadeOut(500);
        WP_GEO_config.show_param_statut = 0;
        WP_GEO_display_message("La carte fermée sans enregistrement.");
    }
}
/*----------------------------------------------------------------------------*\
* function addLigne
\*----------------------------------------------------------------------------*/
function WP_GEO_add_ligne(name,num,table)
{

	var nameTemp = name;
	var isActivate = true;

	if(name == WP_GEO_config.map_name)
		nameTemp = "GEOGRAPHICALGRIDSYSTEMS.MAPS:WMSC";
	if(name == WP_GEO_config.ortho_name)
		nameTemp = "ORTHOIMAGERY.ORTHOPHOTOS:WMSC";

	if( typeof(WP_GEO_config.layers_activate[nameTemp]) === 'undefined')
		isActivate = false;

	var tbody = table.tBodies[0];

	var row = document.createElement("tr");

	var cell_1 = document.createElement("td");
		var input_1 = document.createElement("input");
		input_1.setAttribute("type","checkbox");
		input_1.setAttribute("id","layer_display_"+num);
	
	if (isActivate)
		input_1.setAttribute("checked",true);

	cell_1.appendChild(input_1);
	row.appendChild(cell_1);

	var cell_2 = document.createElement("td");
		var input_2 = document.createElement("input");
		input_2.setAttribute("type","text");
		input_2.setAttribute("disabled","disabled");
		input_2.setAttribute("style","width:300px;");
		input_2.setAttribute("id","layer_name_"+num);
		input_2.value=name;
	cell_2.appendChild(input_2);
	row.appendChild(cell_2);

	var cell_3 = document.createElement("td");
		var input_3 = document.createElement("input");
		input_3.setAttribute("type","checkbox");
		input_3.setAttribute("id","layer_visibility_"+num);
	
		if(isActivate)
		{
			if(WP_GEO_config.layers_activate[nameTemp][0] == 'on')
			{
				input_3.setAttribute("checked",true);
			}
		}
		
	cell_3.appendChild(input_3);
	row.appendChild(cell_3);

	var cell_4 = document.createElement("td");
		var input_4 = document.createElement("input");
		input_4.setAttribute("type","number");
		input_4.setAttribute("min","0");
		input_4.setAttribute("max","1");
		input_4.setAttribute("step","0.1");
		input_4.setAttribute("style","width:50px;");
		input_4.setAttribute("id","layer_opacity_"+num);

		if(isActivate)
			input_4.value=WP_GEO_config.layers_activate[nameTemp][1];
		else
			input_4.value=1;
	cell_4.appendChild(input_4);
	row.appendChild(cell_4);
	
	tbody.appendChild(row);
}
/*----------------------------------------------------------------------------*\
* function visibilite
\*----------------------------------------------------------------------------*/
function WP_GEO_visibilite(thingId)
{
	var targetElement;
	targetElement = document.getElementById(thingId) ;
	if (targetElement.style.display == "none")
	{
		targetElement.style.display = "" ;
	} else {
		targetElement.style.display = "none" ;
	}
}
/*----------------------------------------------------------------------------*\
* function switchMode
\*----------------------------------------------------------------------------*/
function WP_GEO_switch_mode(mode)
{
	if(typeof mode === 'undefined' )
		mode = "";

	if( mode != WP_GEO_config.mode)
	{
	
		WP_GEO_visibilite('layer_simple');
		WP_GEO_visibilite('layer_avanced');

		if (WP_GEO_config.mode == "simple")
			WP_GEO_config.mode = "avanced";
		else
			WP_GEO_config.mode = "simple";
	}
}
/*----------------------------------------------------------------------------*\
* function OnSubmitForm
\*----------------------------------------------------------------------------*/
function WP_GEO_on_submit_form()
{

	var params = WP_GEO_get_params_from_html(true);
	var paramsJSON = JSON.stringify(params);
	document.getElementById("geomap_maps_param").value = paramsJSON;

	return true;
}
/*----------------------------------------------------------------------------*\
* function get_params_from_html
*   id,type,lat,lon,z,territory,geolocate
*   layers_array,kml_array,gpx_array 
\*----------------------------------------------------------------------------*/
function WP_GEO_get_params_from_html(isAdmin)
{
	if(typeof isAdmin === 'undefined')
		isAdmin = false;
	
	var params = {};
    
	params.id="prev";    
	params.territory=document.getElementById("geomap_territory").value;
	params.lat=parseFloat(document.getElementById("geomap_lat").value.replace(',', '.'));
	params.lon=parseFloat(document.getElementById("geomap_lon").value.replace(',', '.'));
	params.z=parseInt(document.getElementById("geomap_z").value,10);
	params.w=parseInt(document.getElementById("geomap_w").value,10);
	params.h=parseInt(document.getElementById("geomap_h").value,10);
	
	if(document.getElementById("geomap_type").checked)
		params.type="normal";
	else
		params.type="mini";
	
	if(!isAdmin)
	{
		if(document.getElementById("geomap_geolocate").checked)
			params.geolocate="true";
		else
			params.geolocate="false";
		
		if(document.getElementById("geomap_graph").checked)
			params.graph="true";
		else
			params.graph="false";
	}
	else
	{
		params.geolocate="false";
		params.graph="false";
	}

	var layers_array_temp = [];
    var layer;
	if(WP_GEO_config.mode == "avanced")
	{
		for(i=0;i<WP_GEO_config.layers_allowed.length;++i)
		{
			var current_layer = WP_GEO_config.layers_allowed[i];
			if( (current_layer.indexOf("WMSC")!= -1) || (current_layer.indexOf("WMTS")!= -1)
				)// on test si c'est bien une couche valide
			{
				if(document.getElementById("layer_display_"+i).checked===true)
				{
					layer = {name:document.getElementById("layer_name_"+i).value,opacity:document.getElementById("layer_opacity_"+i).value,visibility:document.getElementById("layer_visibility_"+i).checked};
                    layers_array_temp.push(layer);
				}
			}
		}
	}
	else
	{
		for(i=0;i<WP_GEO_config.nb_simple_layers;++i)
		{
			if(document.getElementById("layer_display_s_"+i).checked===true)
			{
				var name_layer;
				if( document.getElementById("layer_name_s_"+i).value == WP_GEO_config.ortho_name)
					name_layer = "ORTHOIMAGERY.ORTHOPHOTOS:WMSC";
				
				if( document.getElementById("layer_name_s_"+i).value == WP_GEO_config.map_name)
					name_layer = "GEOGRAPHICALGRIDSYSTEMS.MAPS:WMSC";
				layer = {name:name_layer,opacity:document.getElementById("layer_opacity_s_"+i).value,visibility:document.getElementById("layer_visibility_s_"+i).checked};
                layers_array_temp.push(layer);
			}
		}
	}
	//params.layers_array = JSON.stringify(layers_array_temp);
	params.layers_array= layers_array_temp;

	//TODO : plusieurs gpx
	var gpx_array_temp = [];
	if(!isAdmin)
	{
		var gpx_url = document.getElementById("geomap_gpx_url").value;
		var gpx_title = document.getElementById("geomap_gpx_title").value;
		if( gpx_url !== '')
		{
			if( gpx_title === '')
				gpx_title = 'gpx_layer';
	
			layer = {name:gpx_title,url:gpx_url};
	
			gpx_array_temp.push(layer);
		}
	}
	//params.gpx_array= JSON.stringify(gpx_array_temp);
	params.gpx_array= gpx_array_temp;

	//TODO : plusieurs kml
	var kml_array_temp = [];
	if(!isAdmin)
	{
		var kml_url = document.getElementById("geomap_kml_url").value;
		var kml_title = document.getElementById("geomap_kml_title").value;
		if( kml_url !== '')
		{
			if( kml_title === '')
				kml_title = 'kml_layer';
	
			layer = {name:kml_title,url:kml_url};
	
			kml_array_temp.push(layer);
		}
	}
	//params.kml_array= JSON.stringify(kml_array_temp);
	params.kml_array= kml_array_temp;

	return params;
}
/*----------------------------------------------------------------------------*\
* function set_html_from_params
*   id,type,lat,lon,z,territory,geolocate
*   layers_array,kml_array,gpx_array 
\*----------------------------------------------------------------------------*/
function WP_GEO_set_html_from_params(params)
{
	WP_GEO_config.html_from_params = params;

	WP_GEO_config.API_Load_Clbk = WP_GEO_set_html_from_params_bis;
	
	if(typeof(gGEOPORTALRIGHTSMANAGEMENT) == 'undefined' || WP_GEO_config.layers_allowed === null)
		WP_GEO_load_API();
	else	
		WP_GEO_set_html_from_params_bis();
}
/*----------------------------------------------------------------------------*/
function WP_GEO_set_html_from_params_bis()
{
	var params = WP_GEO_config.html_from_params;

    WP_GEO_config.html_from_params = null;
	//TODO : plusieurs gpx & kml
	document.getElementById("geomap_territory").value = params.territory;
	document.getElementById("geomap_lat").value = params.lat;
	document.getElementById("geomap_lon").value = params.lon;
	document.getElementById("geomap_z").value = params.z;
	document.getElementById("geomap_w").value = params.w;
	document.getElementById("geomap_h").value = params.h;
	

	document.getElementById("geomap_type").value = params.type;
	
	document.getElementById("geomap_geolocate").checked = (params.geolocate == "true");

	document.getElementById("geomap_graph").checked = (params.graph == "true");

	var layers_array;

	if(typeof(params.layers_array) === "string")
        layers_array = JSON.parse(params.layers_array);
	else 
		layers_array = params.layers_array;

	var t = 0;
	for(i=0;i<WP_GEO_config.layers_allowed.length;++i)
	{
		var current_layer = WP_GEO_config.layers_allowed[i];
		if( (current_layer.indexOf("WMSC")!= -1) ||
            (current_layer.indexOf("WMTS")!= -1) )// on test si c'est bien une couche valide
		{
			for(j=0;j<layers_array.length;j++)
			{
				//mode avanced
				if(layers_array[j].name == document.getElementById("layer_name_"+i).value)
				{
					document.getElementById("layer_display_"+i).checked = true;
					document.getElementById("layer_opacity_"+i).value = layers_array[j].opacity;
					document.getElementById("layer_visibility_"+i).checked = layers_array[j].visibility;
				}
				//mode simple : ortho
				if(current_layer.indexOf("ORTHOIMAGERY.ORTHOPHOTOS") != -1)
				{
					t++;
					for(k=0;k<WP_GEO_config.nb_simple_layers;++k)
					{
						if( document.getElementById("layer_name_s_"+k).value == WP_GEO_config.ortho_name)
						{
							document.getElementById("layer_display_s_"+k).checked = true;
							document.getElementById("layer_opacity_s_"+k).value = layers_array[j].opacity;
							document.getElementById("layer_visibility_s_"+k).checked = layers_array[j].visibility;
						}
					}
				}
				//mode simple : map
				if(current_layer.indexOf("GEOGRAPHICALGRIDSYSTEMS.MAPS") != -1)
				{
					t++;
					for(k=0;k<WP_GEO_config.nb_simple_layers;++k)
					{
						if( document.getElementById("layer_name_s_"+k).value == WP_GEO_config.map_name)
						{
							document.getElementById("layer_display_s_"+k).checked = true;
							document.getElementById("layer_opacity_s_"+k).value = current_layer.opacity;
							document.getElementById("layer_visibility_s_"+k).checked = current_layer.visibility;
						}
					}
				}
			}
		}
	}
	
	if( (layers_array.length <=t)  ) //il y a que deux couches "simples", on passe en mode simple
		WP_GEO_switch_mode("simple");
	else
		WP_GEO_switch_mode("avanced");

	//TODO : plusieurs gpx
	var gpx_array;
	if(typeof(params.gpx_array) === "string")
    {
        //gpx_array = eval( '(' + params["gpx_array"] + ')');
        gpx_array = JSON.parse(params.gpx_array);
    }
	else 
		gpx_array = params.gpx_array;

	if(gpx_array.length>0)
	{
		document.getElementById("geomap_gpx_url").value = gpx_array[0].url;
		document.getElementById("geomap_gpx_title").value = gpx_array[0].name;
	}

	//TODO : plusieurs kml
	var kml_array;
	if(typeof(params.kml_array) === "string")
    {
        //kml_array = eval( '(' + params["kml_array"] + ')');   
        kml_array = JSON.parse(params.kml_array);
    }
	else 
		kml_array = params.kml_array;
		
	if(kml_array.length>0)
	{
		document.getElementById("geomap_kml_url").value = kml_array[0].url;
		document.getElementById("geomap_kml_title").value = kml_array[0].name;
	}
	
}
/*----------------------------------------------------------------------------*\
* function newMap
\*----------------------------------------------------------------------------*/
function WP_GEO_new_map()
{
	if(WP_GEO_config.show_param_statut === 0)
	{
		jQuery("#map_bd_builder").fadeOut(500);
		jQuery("#form_builder_div").fadeIn(500);
		WP_GEO_config.show_param_statut =1;
	}
	WP_GEO_config.id_current_map			= -1;
	WP_GEO_config.is_current_map_save		= false;
	WP_GEO_display_message("Nouvelle carte");
}
/*----------------------------------------------------------------------------*\
* function on_change_setting
\*----------------------------------------------------------------------------*/
function WP_GEO_on_change_setting()
{
	WP_GEO_config.is_current_map_save		= false;
	WP_GEO_display_message("Carte modifiée");
}
/*----------------------------------------------------------------------------*\
* function display_message
\*----------------------------------------------------------------------------*/
function WP_GEO_display_message(message)
{
	jQuery("#geomap_message").fadeOut(0);
	jQuery("#geomap_message").html(message);
	jQuery("#geomap_message").fadeIn(250);
}
/*----------------------------------------------------------------------------*\
* function display_message_admin
\*----------------------------------------------------------------------------*/
function WP_GEO_display_message_admin(message)
{
	jQuery("#geomap_message_admin").fadeOut(0);
	jQuery("#geomap_message_admin").html(message);
	jQuery("#geomap_message_admin").fadeIn(250);
}
/****************************************************************************************************************************\
*	Maps.js
*	Project : Geoportail-Shortcode
*	Date : 10/05/12
*	Auteur : geoWP
/****************************************************************************************************************************/

/*----------------------------------------------------------------------------*/
if (window.__Geoportal$timer===undefined)
{
	var __Geoportal$timer= null;
}
/*----------------------------------------------------------------------------*\
* checkApiLoading
\*----------------------------------------------------------------------------*/
function WP_GEO_check_api_loading(retryClbk,clss)
{
	if (__Geoportal$timer!==null)
	{
		window.clearTimeout(__Geoportal$timer);
		__Geoportal$timer= null;
	}
	var f;
	for (var i=0, l= clss.length; i<l; i++)
	{
		try
		{
			f= eval(clss[i]);
		} catch (e)
		{
			f= undefined;
		}
		if (typeof(f)==='undefined')
		{
            __Geoportal$timer= window.setTimeout(retryClbk, 300);
			return false;
		}
	}
	return true;
}
/*----------------------------------------------------------------------------*\
* function loadAPI
\*----------------------------------------------------------------------------*/
function WP_GEO_load_API() {


	// on attend que les classes soient chargées
	if(WP_GEO_check_api_loading(
				WP_GEO_load_API,
				['OpenLayers','Geoportal','Geoportal.Viewer','Geoportal.Viewer.Default']
			) === false
		)
	{
		return;
	}
	// on charge la configuration de la clef API
	Geoportal.GeoRMHandler.getConfig(
		API_KEY,null,null,
		{onContractsComplete:
			function ()
			{
				WP_GEO_config.layers_allowed = gGEOPORTALRIGHTSMANAGEMENT[gGEOPORTALRIGHTSMANAGEMENT.apiKey].allowedGeoportalLayers;
				if(WP_GEO_config.API_Load_Clbk !== null)
				{
					__Geoportal$timer= window.setTimeout(WP_GEO_config.API_Load_Clbk, 0);
				}
			}
		});
}
/*----------------------------------------------------------------------------*\
* function delete_map
\*----------------------------------------------------------------------------*/
function WP_GEO_delete_map(id) {
	WP_GEO_config.viewers_tab[id] = null;
}
/*----------------------------------------------------------------------------*\
* function create_map
* params :
*	id,type,lat,lon,z,territory,geolocate
*	layers_array,kml_array,gpx_array 
* TODO:
*	gpx_graph ?
*	wms ?
\*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*\
* function active_form
\*----------------------------------------------------------------------------*/
function WP_GEO_create_map(params)
{

	WP_GEO_config.API_Load_Clbk = WP_GEO_create_map_bis;	
	WP_GEO_config.param_list.push(params);
	
	if(typeof(gGEOPORTALRIGHTSMANAGEMENT) == 'undefined' || WP_GEO_config.layers_allowed === null)
		WP_GEO_load_API();
	else	
		WP_GEO_create_map_bis();
}
/*----------------------------------------------------------------------------*/
function WP_GEO_create_map_bis()
{
	
	for (i=0;i<WP_GEO_config.param_list.length;i++)
	{
		WP_GEO_create_map_ter(WP_GEO_config.param_list[i]);
		//WP_GEO_create_chart(WP_GEO_config["param_list"][i]);
	}

	WP_GEO_config.param_list=[];

}
/*----------------------------------------------------------------------------*/
function WP_GEO_create_map_ter(params)
{

	var id = params.id;
	
	//options for creating viewer:
	var options= OpenLayers.Util.extend(
		{
			territory:params.territory,
			mode:params.type
		},
		gGEOPORTALRIGHTSMANAGEMENT || {}
	);

	var viewer = new Geoportal.Viewer.Default("map_"+params.id,options);
    //var viewer = new Geoportal.Viewer.Simple("map_"+params.id,options);
	WP_GEO_config.viewers_tab[id] = viewer;
	if (!viewer) {
		// problem ...
		OpenLayers.Console.error("Création de la carte échouée");
		return;
	}
    
	
	var map = viewer.getMap();

/******************************************************************************/
//map center
	map.setCenterAtLonLat(parseFloat(params.lon),parseFloat(params.lat),parseInt(params.z,10));
	
	/*****************/
	/*TODO : recherche par adresse ?
	var tbx= map.getControlsByClass('Geoportal.Control.ToolBox')[0];
	var panel= new Geoportal.Control.Panel({
		div:OpenLayers.Util.getElement(tbx.id+'_search')
	});

	var gazetteer= new Geoportal.Control.LocationUtilityService.GeoNames(
		new Geoportal.Layer.OpenLS.Core.LocationUtilityService(
			'TOPONYMS.ALL:OPENLS',
			{
				formatOptions: { version:'1.2' }
			}
		),
		{
			title: 'gpControlLocationUtilityService.geonames.title',
			setZoom:Geoportal.Control.LocationUtilityService.GeoNames.setZoomForBDNyme
    }
	);
	panel.addControls([gazetteer]);
	map.addControls([panel]);
	*/
	
	/*****************/

	/* TODO: Pour la météo avec OWM
	var mapnik = new OpenLayers.Layer.OSM();
	var stations = new OpenLayers.Layer.Vector.OWMClusterStations("Stations");
	var city = new OpenLayers.Layer.Vector.OWMWeather("Weather");
	map.addLayers([mapnik,stations,city]);
	*/
	
	if(params.layers_array !== null)
		WP_GEO_add_layers(params.layers_array,id);
	
	if(params.kml_array !== null)
		WP_GEO_add_kml(params.kml_array,id);
	
	if(params.gpx_array !== null)
		WP_GEO_add_gpx_array(params.gpx_array,id,params.graph);
	
	if(params.geolocate != 'false')
		WP_GEO_add_geolocate(id,params.z);

    // TODO OSM
    //if(params.osm != 'false')
    //    WP_GEO_add_osm(id);
}
/*----------------------------------------------------------------------------*\
// Avanced Layers
/*----------------------------------------------------------------------------*/
function WP_GEO_add_layers(layers_array_in,id)
{
	var viewer = WP_GEO_config.viewers_tab[id];
	var layers_array;

	if(typeof(layers_array_in) === "string")
    {
        //layers_array = eval( "("+ layers_array_in + ")" );    
        layers_array = JSON.parse(layers_array_in);
    }
	else
		layers_array = layers_array_in;
	
	for(var i=(layers_array.length-1);i>=0;i--)
	{
		var layer_options =
			{
				opacity:layers_array[i].opacity,
				visibility:layers_array[i].visibility
			};
			
			//Pour assurer la compatibilité avec les anciennes version de l'api.
			layers_array[i].name = layers_array[i].name.replace("WMSC","WMTS");

			
		viewer.addGeoportalLayer(layers_array[i].name,layer_options);
	}
}

/*----------------------------------------------------------------------------*\
//osm
/*----------------------------------------------------------------------------*/
function WP_GEO_add_osm(id)
{
    var viewer = WP_GEO_config.viewers_tab[id];
	var map = viewer.getMap();
    
    layer = new OpenLayers.Layer.OSM( "OSM");
    map.addLayer(layer);
}
/*----------------------------------------------------------------------------*\
//kml_array
/*----------------------------------------------------------------------------*/
function WP_GEO_add_kml(kml_array_in,id)
{
	var viewer = WP_GEO_config.viewers_tab[id];
	var map = viewer.getMap();

	var kml_array;

	if(kml_array_in.length !== null)
		kml_array = kml_array_in;
	else
    {
        //kml_array = eval( "("+ kml_array_in + ")" );    
        kml_array = JSON.parse(kml_array_in);
    }
	
	for(var i=0;i<kml_array.length;i++)
	{
		map.addLayer(
			"KML",
			kml_array[i].name,
			kml_array[i].url,
			{
				visibility:true,
				minZoomLevel:1,
				maxZoomLevel:16
			}
		);
	}
}
/*----------------------------------------------------------------------------*\
//gpx_array
/*----------------------------------------------------------------------------*/
function WP_GEO_add_gpx_array(gpx_array_in,id,plot_graph)
{
	var viewer = WP_GEO_config.viewers_tab[id];
	var map = viewer.getMap();

	var gpx_array;

	if(gpx_array_in.length !== null)
		gpx_array = gpx_array_in;
	else
        gpx_array = JSON.parse(gpx_array_in);

	
	WP_GEO_config.mouse_pos[id] = new OpenLayers.Control.MousePosition();
	// Pour cacher l'affichage de la positon du curseur
	WP_GEO_config.mouse_pos[id].formatOutput = function(e) {return '';};
	map.addControl(WP_GEO_config.mouse_pos[id]);
    
	for(var i=0;i<gpx_array.length;i++)
	{
		WP_GEO_add_gpx(gpx_array[i],id,plot_graph);
	}
}
/*----------------------------------------------------------------------------*\
//gpx_array
/*----------------------------------------------------------------------------*/
function WP_GEO_add_gpx(gpx,id,plot_graph)
{
	if(gpx.maps === null || gpx.maps === undefined)
		WP_GEO_get_gpx(gpx,id,plot_graph);
	else
	{
		var viewer = WP_GEO_config.viewers_tab[id];
		var map = viewer.getMap();

		var sourceproj= OpenLayers.Projection.CRS84; // WGS84
		var destproj= viewer.projection; // projection Geoportail
	
		var vect = new OpenLayers.Layer.Vector(
			gpx.name,
			{
				visibility:true,
				minZoomLevel:1,
				maxZoomLevel:16,
				styleMap: new OpenLayers.StyleMap({
					pointRadius: 7,
					externalGraphic:"",
					//externalGraphic:"http://www.openlayers.org/dev/img/marker.png",
					graphicOpacity:1,
					strokeColor: "blue",
					strokeWidth: 3,
					strokeOpacity: 0.8,
					fillOpacity: 0.2,
					fillColor: "blue"
				})
			});
		//
		if(plot_graph)
		{
			vect.viewer_id = id;
			vect.events.on(
				{
						'featureselected': WP_GEO_onFeatureSelect,
						'featureunselected': WP_GEO_onFeatureUnselect
				});

			control = new OpenLayers.Control.SelectFeature(vect,{hover: true});
			map.addControl(control);
			control.activate();
		}
		//
		if(gpx.waypoints !== undefined && gpx.waypoints.length !== undefined)
		{
			for(k=0; k<gpx.waypoints.length; k++)
			{
				var wp = gpx.waypoints[k];
		
				var point = new OpenLayers.Geometry.Point(wp.lon,wp.lat);
				point.transform(sourceproj, destproj);
				var f = new OpenLayers.Feature.Vector(point, wp);
				vect.addFeatures([f]);
			}
		}
		//
		var wkt_parser = new OpenLayers.Format.WKT();
		var features = wkt_parser.read(gpx.maps);
		if(features)
		{
			if(features.length !== undefined)// on a un tableau
			{
				for(var j=0;j<features.length;j++)
					features[j].geometry.transform(sourceproj, destproj);
				vect.addFeatures(features);
			}
			else // on a d'une feature
			{
				features.geometry.transform(sourceproj, destproj);
				vect.addFeatures([features]);
			}
		}
		map.addLayers([vect]);
	}
}
/******************************************************************************/
//wms TODO
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

/*----------------------------------------------------------------------------*\
* geolocate
/*----------------------------------------------------------------------------*/
function WP_GEO_add_geolocate(id,zoom)
{
	var viewer = WP_GEO_config.viewers_tab[id];
	var map = viewer.getMap();
	var geolocate = new OpenLayers.Control.Geolocate({
		bind: true,
		geolocationOptions: {
			enableHighAccuracy: false,
			maximumAge: 0,
			timeout: 7000
		}
	});
	map.addControl(geolocate);
	var pulsate = function(feature)
		{
			var point = feature.geometry.getCentroid(),
					bounds = feature.geometry.getBounds(),
					radius = Math.abs((bounds.right - bounds.left)/2),
					count = 0,
					grow = "up";
			var resize = function()
				{
                    if (count>16)
                        clearInterval(window.resizeInterval);
                    var interval = radius * 0.03;
                    var ratio = interval/radius;
                    switch(count)
                    {
                        case 4:
                        case 12:
                            grow = "down"; break;
                        case 8:
                        grow = "up"; break;
                    }
                    if (grow!=="up")
                        ratio = - Math.abs(ratio);

                    feature.geometry.resize(1+ratio, point);
                    vector.drawFeature(feature);
                    count++;
				};
			window.resizeInterval = window.setInterval(resize, 50, point, radius);
		};
	var vector = new OpenLayers.Layer.Vector("myLocation");
	map.addLayers([vector]);
	geolocate.events.register("locationupdated",geolocate,function(e)
		{
			map.setCenterAtLonLat(
									e.point.x,
									e.point.y,
									zoom
                    );
			vector.removeAllFeatures();
			var circle = new OpenLayers.Feature.Vector(
                    OpenLayers.Geometry.Polygon.createRegularPolygon(
                        new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                        e.position.coords.accuracy/2,
                        40,
                        0
                    ),
					{},
					{
                        fillColor: "#000",
                        fillOpacity: 0.1,
                        strokeWidth: 0
				}
			);
			vector.addFeatures([
                new OpenLayers.Feature.Vector(
                        e.point,
                        {},
                        {
                            graphicName: "cross",
                            strokeColor: "#f00",
                            strokeWidth: 2,
                            fillOpacity: 0,
                            pointRadius: 10
                        }
                    ),
                    circle
                ]);
			pulsate(circle);
		});
	geolocate.activate();
}
/*----------------------------------------------------------------------------*\
* function onFeatureSelect
*	
\*----------------------------------------------------------------------------*/
function WP_GEO_onFeatureSelect(e)
{
    var layer = e.feature.layer;
	var viewer_id = layer.viewer_id;
	// on récupère la derniere position de la souris
    var xy=WP_GEO_config.mouse_pos[viewer_id].lastXy;
    var lonlat = layer.getLonLatFromViewPortPx(xy);
    var point = new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);
    // on recupere les points de la ligne survolee
    var line = e.feature.geometry.getVertices();
    // on cherche le point le plus proche
    var dMin=999999999999;
    var idMin=0;
    for(j=0; j<line.length; j++)
    {
        var pt_cur = line[j];
        var d_cur = pt_cur.distanceTo(point);
        if( d_cur < dMin)
        {
            idMin = j;
            dMin = d_cur;
        }
    }
    if(idMin !==0)// pour regler un petit bug
    {
        //on affiche le point
        WP_GEO_display_point_layer(idMin,layer);
        WP_GEO_display_point_chart(idMin,layer.name,viewer_id,xy.x,xy.y);
    }
}
/*----------------------------------------------------------------------------*\
* function onFeatureUnselect
*	
\*----------------------------------------------------------------------------*/
function WP_GEO_onFeatureUnselect(e) 
{
	// on supprime le point apres un certain detail
	var viewer_id =e.feature.layer.viewer_id;
	setTimeout(function() {
			WP_GEO_remove_tooltip();
			WP_GEO_remove_point();
			WP_GEO_remove_corsshair(viewer_id);
		},1500);
}
/*----------------------------------------------------------------------------*\
* function displayPoint
* affiche un point courant le long de la trajecto des GPX
\*----------------------------------------------------------------------------*/
function WP_GEO_display_point(pt_id,layer_name,viewer_id)
{
	
	//on recupere la map
	var map = WP_GEO_config.viewers_tab[viewer_id].getMap();
	var layers = map.getLayersByName(layer_name);
	if(layers.length !== 0)
	{
		var layer = layers[0];
		WP_GEO_display_point_layer(pt_id,layer);
	}

}
/*----------------------------------------------------------------------------*\
* function displayPointLayer
* affiche un point courant le long de la trajecto des GPX
\*----------------------------------------------------------------------------*/
function WP_GEO_display_point_layer(pt_id,layer)
{
	// Supprime ancien point
	WP_GEO_remove_point();
	WP_GEO_config.layer_cur = layer;
	
	var multilines;
	var fini = false;
	var id=0;
	while(!fini)
	{
        multilines = WP_GEO_config.layer_cur.features[id].geometry.components;
        fini = (multilines !== undefined);
        id++;
	}
	var i = 0;
	var vertices;
	fini = false;
	while(!fini && i < multilines.length)
	{
		vertices = multilines[i].getVertices();
		if(pt_id >= vertices.length)
		{
			i+=1;
			pt_id -= vertices.length;
		}else
		{
			fini = true;
		}
	}
	if(!fini)
		alert("pb multilignes");
	//multilinestring
	var point = vertices[pt_id];
	WP_GEO_config.pt_cur = new OpenLayers.Feature.Vector(point);
	WP_GEO_config.layer_cur.addFeatures([WP_GEO_config.pt_cur]);
}
/*----------------------------------------------------------------------------*\
* function removePoint
\*----------------------------------------------------------------------------*/
function WP_GEO_remove_point()
{
	// Supprime ancien point
	if((WP_GEO_config.layer_cur !== null) && (WP_GEO_config.pt_cur !== null) )
		WP_GEO_config.layer_cur.removeFeatures([WP_GEO_config.pt_cur]);
}
