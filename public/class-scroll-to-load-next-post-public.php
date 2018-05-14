<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Scroll_To_Load_Next_Post
 * @subpackage Scroll_To_Load_Next_Post/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Scroll_To_Load_Next_Post
 * @subpackage Scroll_To_Load_Next_Post/public
 * @author     Adi Li <adi@snaptee.co>
 */
class Scroll_To_Load_Next_Post_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Scroll_To_Load_Next_Post_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Scroll_To_Load_Next_Post_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if ( $this->should_include() ) {
			wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/scroll-to-load-next-post-public.css', array(), $this->version, 'all' );
		}

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Scroll_To_Load_Next_Post_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Scroll_To_Load_Next_Post_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if ( $this->should_include() ) {
			wp_enqueue_script( $this->plugin_name . '-jquery-keepscrolling', plugin_dir_url( __FILE__ ) . 'js/keepscrolling.jquery.js', array( 'jquery' ), $this->version, false );
			$js = apply_filters( 's2lnp_main_js', null );
			// var_dump($js);die();
			wp_enqueue_script( $this->plugin_name, $js['file'], array( $this->plugin_name . '-jquery-keepscrolling' ), $js['version'], false );
		}

	}

	private function should_include() {
		return current_theme_supports('scroll-to-load-next-post') && is_singular('post');
	}

	public function get_main_js_file() {
		return array(
			'file' => plugin_dir_url( __FILE__ ) . 'js/scroll-to-load-next-post-public.js',
			'version' => $this->version,
		);
	}
}
