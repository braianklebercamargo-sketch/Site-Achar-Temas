<?php
/**
 * Main Template File
 *
 * This file is just a wrapper for the React application.
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700；800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
    <?php wp_head(); ?>
    <style>
        body { margin: 0; padding: 0; }
        #root { min-height: 100vh; }
    </style>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <div id="root"></div>
    <?php wp_footer(); ?>
</body>
</html>
