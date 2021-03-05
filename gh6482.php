<?php

use Automattic\WooCommerce\Admin\Loader;
use Automattic\WooCommerce\Admin\Features\Onboarding;

/*
 * Plugin Name: GitHub #6482 test case
 * Description: GitHub #6482 test case
 * Version: 1.0.0
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class gh6482 {
	private $base_dir = '';

	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		add_filter( 'woocommerce_get_registered_extended_tasks', array( $this, 'register_extended_task' ), 10, 1 );
		$this->base_dir = dirname( __FILE__ );
	}

	/**
	 * Register the task list item and the JS.
	 */
	public function admin_enqueue_scripts() {

		if (
			! class_exists( 'Automattic\WooCommerce\Admin\Loader' ) ||
			! Loader::is_admin_page() ||
			! Onboarding::should_show_tasks()
		) {
			return;
		}

		$asset_file = require plugin_dir_path( __FILE__ ) . 'js/dist/setup-tasks.asset.php';
		wp_register_script(
			'my-setup-tasks',
			plugins_url( basename( $this->base_dir ) . '/js/dist/setup-tasks.js' ),
			// With the dependencies set statically as below (bad I know - but as per the example code), this throws an
			// error if compiled against Woocommerce 5.1.0-rc.1, but *works* if compiled against
			// woocommerce-admin (2.2.0-dev).
			array(
				'wp-i18n',
				'wp-hooks',
				'wp-api-fetch',
				'wp-components',
				'wc-components'
			),
			time(),
			// Pulling in the dependencies / version from the generated .asset.php file works in both cases.
			//
			// $asset_file['dependencies'],
			// $asset_file['version'],
			true
		);

		$l10n_data = array(
			'my_configure_settings_is_complete' => get_option(
				'my_configure_settings_is_complete',
				false
			),
		);
		wp_localize_script(
			'my-setup-tasks',
			'my_setup_tasks_data',
			$l10n_data
		);
		wp_enqueue_script( 'my-setup-tasks' );
	}

	public function register_extended_task( $registered_tasks_list_items ) {
		$setup_tasks = array(
			'my_configure_settings',
		);
		foreach ( $setup_tasks as $setup_task ) {
			if ( ! in_array( $setup_task, $registered_tasks_list_items, true ) ) {
				array_push( $registered_tasks_list_items, $setup_task );
			}
		}

		return $registered_tasks_list_items;
	}
}

new gh6482();
