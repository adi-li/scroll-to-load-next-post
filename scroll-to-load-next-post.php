<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://example.com
 * @since             1.0.0
 * @package           Scroll_To_Load_Next_Post
 *
 * @wordpress-plugin
 * Plugin Name:       Scroll to load next post
 * Plugin URI:        http://example.com
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Adi Li
 * Author URI:        http://example.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       scroll-to-load-next-post
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'SCROLL_TO_LOAD_NEXT_POST_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-scroll-to-load-next-post-activator.php
 */
function activate_scroll_to_load_next_post() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-scroll-to-load-next-post-activator.php';
	Scroll_To_Load_Next_Post_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-scroll-to-load-next-post-deactivator.php
 */
function deactivate_scroll_to_load_next_post() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-scroll-to-load-next-post-deactivator.php';
	Scroll_To_Load_Next_Post_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_scroll_to_load_next_post' );
register_deactivation_hook( __FILE__, 'deactivate_scroll_to_load_next_post' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-scroll-to-load-next-post.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_scroll_to_load_next_post() {

	$plugin = new Scroll_To_Load_Next_Post();
	$plugin->run();

}
run_scroll_to_load_next_post();
