<?php

/**
 * Main Views controller.
 *
 * @since 2.5.0
 * @since m2m WPV_Ajax included
 */
class WPV_Main {

	public function initialize() {
		$this->add_hooks();
	}

	public function add_hooks() {
		add_action( 'toolset_common_loaded', array( $this, 'register_autoloaded_classes' ) );
		add_action( 'toolset_common_loaded', array( $this, 'initialize_classes' ) );

		add_action( 'after_setup_theme', array( $this, 'init_api' ), 9999 );

		add_action( 'init', array( $this, 'on_init' ), 1 );
	}

	/**
	 * Register Views classes with Toolset_Common_Autoloader.
	 *
	 * @since 2.5.0
	 */
	public function register_autoloaded_classes() {
		$classmap = include WPV_PATH . '/application/autoload_classmap.php';
		do_action( 'toolset_register_classmap', $classmap );
	}

	public function initialize_classes() {
		/**
		 * @var \OTGS\Toolset\Common\Auryn\Injector
		 */
		$dic = apply_filters( 'toolset_dic', false );

		/**
		 *  @var \OTGS\Toolset\Views\Controller\Cache $plugin_cache
		 */
		$plugin_cache = $dic->make( '\OTGS\Toolset\Views\Controller\Cache' );
		$plugin_cache->initialize();

		/**
		 *  @var \OTGS\Toolset\CRED\Controller\Upgrade $cred_upgrade
		 */
		$wpv_upgrade = $dic->make( '\OTGS\Toolset\Views\Controller\Upgrade' );
		$wpv_upgrade->initialize();

		// Initilize the compatibility between Views and other third-party or OTGS plugins.
		$compatibility = new \OTGS\Toolset\Views\Controller\Compatibility();
		$compatibility->initialize();

		// @since 2.6.4
		if ( is_admin() ) {
			if ( defined( 'DOING_AJAX' ) ) {
				WPV_Ajax::initialize();
			} else {
				WPV_Admin::initialize();
			}
		}

		// @since m2m
		$filter_manager = WPV_Filter_Manager::get_instance();
		$filter_manager->initialize();
	}

	/**
	 * Init the public Views filters API.
	 *
	 * @note This gets available at after_setup_theme:9999 because we need to wait for Toolset Common to fully load.
	 *
	 * @since m2m
	 */
	public function init_api() {
		WPV_Api::initialize();
	}

	public function on_init() {
		$wpv_shortcodes = new WPV_Shortcodes();
		$wpv_shortcodes->initialize();
		$wpv_shortcodes_gui = new WPV_Shortcodes_GUI();
		$wpv_shortcodes_gui->initialize();
		$wpv_lite_handler = new WPV_Lite_Handler();
		$wpv_lite_handler->initialize();
	}
}
