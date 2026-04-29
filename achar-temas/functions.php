<?php
/**
 * Achar Temas - Functions
 */

function achar_temas_enqueue_scripts() {
    $theme_version = wp_get_theme()->get('Version');
    $theme_dir = get_template_directory_uri();

    // Enqueue React static files
    // You must run `npm run build:wp` to generate these files inside the theme folder.

    $dist_dir = get_template_directory() . '/dist/assets';
    if(is_dir($dist_dir)) {
        $files = scandir($dist_dir);
        foreach($files as $file) {
            if(pathinfo($file, PATHINFO_EXTENSION) === 'css') {
                wp_enqueue_style('achar-temas-css-' . md5($file), $theme_dir . '/dist/assets/' . $file, array(), $theme_version);
            }
            if(pathinfo($file, PATHINFO_EXTENSION) === 'js') {
                wp_enqueue_script('achar-temas-js-' . md5($file), $theme_dir . '/dist/assets/' . $file, array(), $theme_version, true);
            }
        }
    }
}
add_action('wp_enqueue_scripts', 'achar_temas_enqueue_scripts');

function achar_temas_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'achar_temas_setup');

// Redireciona todas as rotas não encontradas no backend para o index.php do tema para que o React lide com o roteamento
function achar_temas_rewrite_rule() {
    add_rewrite_rule('^/(.+)/?', 'index.php', 'top');
}
add_action('init', 'achar_temas_rewrite_rule');
