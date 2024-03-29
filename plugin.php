<?php
/**
 * Plugin Name: Gutestrap
 * Plugin URI: https://github.com/Denman-Digital/gutestrap
 * Description: Supercharge your Gutenberg layouts with Bootstrap Grid (and other goodies).
 * Author: Denman Digital
 * Author URI: https://denman.digital
 * Version: 1.3.15-bsv4
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package gutestrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) ||	exit;

if (!defined("WP_DEBUG")) {
	define("WP_DEBUG", false);
}
if (!defined("WP_DEBUG_LOG")) {
	define("WP_DEBUG_LOG", false);
}

/**
 * PHP Dependencies
 */
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';

