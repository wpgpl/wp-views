<?php

/**
* wpv-deprecated.php
*
* Holds some functions that might be deprecated but it is worth checking using Code Coverage
*
* @since 1.6.2
*/

// @todo get_user_meta_keys is DEPRECATED and kept for backwards compatibility as it is called from common - let's remove it from there before deleting this.

function get_user_meta_keys( $include_hidden = false ) {
	global $wpdb;
	$values_to_prepare = array();
	//static $cf_keys = null;
	$umf_mulsitise_string = " 1 = 1 ";
	if ( is_multisite() ) {
		global $blog_id;
		$umf_mulsitise_string = " ( meta_key NOT REGEXP '^{$wpdb->base_prefix}[0-9]_' OR meta_key REGEXP '^{$wpdb->base_prefix}%d_' ) ";
		$values_to_prepare[] = $blog_id;
	}
	$umf_hidden = " 1 = 1 ";
	if ( ! $include_hidden ) {
		$hidden_usermeta = array('first_name','last_name','name','nickname','description','yim','jabber','aim',
		'rich_editing','comment_shortcuts','admin_color','use_ssl','show_admin_bar_front',
		'capabilities','user_level','user-settings',
		'dismissed_wp_pointers','show_welcome_panel',
		'dashboard_quick_press_last_post_id','managenav-menuscolumnshidden',
		'primary_blog','source_domain',
		'closedpostboxes','metaboxhidden','meta-box-order_dashboard','meta-box-order','nav_menu_recently_edited',
		'new_date','show_highlight','language_pairs',
		'module-manager',
		'screen_layout');
	//	$umf_hidden = " ( meta_key NOT REGEXP '" . implode("|", $hidden_usermeta) . "' AND meta_key NOT REGEXP '^_' ) "; // NOTE this one make sites with large usermeta tables to fall
		$umf_hidden = " ( meta_key NOT IN ('" . implode("','", $hidden_usermeta) . "') AND meta_key NOT REGEXP '^_' ) ";
	}
	$where = " WHERE {$umf_mulsitise_string} AND {$umf_hidden} ";
	$values_to_prepare[] = 100;
	$usermeta_keys = $wpdb->get_col(
		$wpdb->prepare(
			"SELECT DISTINCT meta_key FROM {$wpdb->usermeta}
			{$where}
			LIMIT 0, %d",
			$values_to_prepare
		)
	);
	if ( ! empty( $usermeta_keys ) ) {
		natcasesort( $usermeta_keys );
	}
	return $usermeta_keys;
}

/*
* ---------------------
* TEMPORARY FUNCTIONS
* ---------------------
*/

add_action( 'wp_ajax_set_view_template', 'wpv_deprecated_set_view_template_callback' );

/**
 * Ajax function to set the current content template to posts of a type set in $_POST['type'].
 *
 * @since unknown
 * @deprecated 2.8
 * @delete 3.0
 */
function wpv_deprecated_set_view_template_callback() {
	_deprecated_hook( 'wp_ajax_set_view_template', 'Toolset Views 2.8' );
	wp_send_json_error();
}
