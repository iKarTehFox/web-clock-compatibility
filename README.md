[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](https://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/compatibility-pc-load-letter.svg)](https://forthebadge.com)

# Online Web Clock (Compatibility version)
> **An online digital clock web app built with Bootstrap 4.6.2, focused on browser compatibility!**  
**Note:** This is designed to be compatible with ***ancient browsers***. For modern browsers, [**check out the main repository**](https://github.com/iKarTehFox/web-clock)!

**Website:** [View it in your browser!](https://online-clock-compatibility.pages.dev)

## Table of Contents
- [How to Run](#how-to-run)
- [Features](#features)
- [Gallery](#gallery)
- [Acknowledgements (OSS)](#acknowledgements-oss)
- [Acknowledgements (Fonts)](#acknowledgements-fonts)

## How to Run
1. Serve `index.html` at the root directory with your favorite web server.

**Note:** If you're interested in learning about the changes implemented for backwards compatibility, please read [**compatibility-changes.txt**](/compatibility-changes.txt).

## Features

### Clock Mode
 - Pick between 12 or 24-hour clock modes
### Clock Display
 - Display the time in 7 different methods (Radix/Conversions)  
 - Add a box/bottom border to the clock container (solid, dashed, dotted, double)  
 - Toggle seconds progress bar below clock
### Date Format and Alignment
 - Set 4 different date formats (or disable!)  
 - Date position alignment (left, center, and right)
### Font Customization
 - 13 predefined font families, or system default  
 - Set custom font from installed system fonts  
 - Regular and _Italicized_ font styles  
 - Light, regular, and **bold** font weights  
 - 5 different font sizes  
 - Text shadow customization  
### Background Theme
 - Color fade mode - Automatically transitions between 6 colors  
 - Solid color mode - Choose from 33 different colors  
 - Background image mode - Upload and set a custom image from your device + change sizing  
 - Text color override - Set a custom clock text color
### Menu Visibility
 - Toggle displaying of the menu button
### Importing/Exporting Settings
 - Import and export generated JSON files containing all of your settings  
   - Imported JSON files and settings are verified before applying.

 Try out my [personal config](/assets/usdonlineclock-preset.json)!  

 Using an AMOLED screen? Use [this AMOLED preset](/assets/usdonlineclock-amoled-preset.json) to prevent burn-in!
 
### Page Duration
 - Page duration indicator on the menu shows time spent staring at and customizing the clock...
 
# Gallery
### Preview of the page  
 ![A screenshot of the main web clock page. The time 6:19 PM and date of 7/18/2023 is shown against a white background.](/assets/images/main.png)  
### Menu options pane
 ![A screenshot of the menu options panel. The "Clock Settings" section is opened.](/assets/images/menu.png)  
### Customization example
 ![A screenshot of the main web clock page with many customizations applied, such as custom font, background color, and date format.](/assets/images/customizable.png)  
 Like this look? See [Importing/Exporting Settings](https://github.com/iKarTehFox/web-clock/tree/compatibility?tab=readme-ov-file#importingexporting-settings) for the config!
 
# Acknowledgements (OSS)
 
- **Bootstrap** ([Link](https://getbootstrap.com/)): Licensed under MIT License

- **core-js** ([GitHub](https://github.com/zloirock/core-js)): Licensed under MIT License
 
- **Material Design Icons by Pictogrammers** ([GitHub](https://github.com/Templarian/MaterialDesign)): Licensed under Apache License 2.0
 
- **Luxon** ([GitHub](https://github.com/moment/luxon)): Licensed under MIT License
 
- **number-to-words** ([GitHub](https://github.com/marlun78/number-to-words)): Licensed under MIT License

Each license can be found in the code's respective files or website.
 
# Acknowledgements (Fonts)
 
- **Dancing Script** ([Link](https://fonts.google.com/specimen/Dancing+Script)): Licensed under SIL Open Font License 1.1

- **Merriweather** ([Link](https://fonts.google.com/specimen/Merriweather)): Licensed under SIL Open Font License 1.1

- **Nanum Brush Script** ([Link](https://fonts.google.com/specimen/Nanum+Brush+Script)): Licensed under SIL Open Font License 1.1
 
- **Lato** ([Link](https://fonts.google.com/specimen/Lato)): Licensed under SIL Open Font License 1.1
 
- **Montserrat** ([Link](https://fonts.google.com/specimen/Montserrat)): Licensed under SIL Open Font License 1.1
 
- **Open Sans** ([Link](https://fonts.google.com/specimen/Open+Sans)): Licensed under SIL Open Font License 1.1
 
- **Oswald** ([Link](https://fonts.google.com/specimen/Oswald)): Licensed under SIL Open Font License 1.1

- **Pangolin** ([Link](https://fonts.google.com/specimen/Pangolin)): Licensed under SIL Open Font License 1.1
 
- **Poppins** ([Link](https://fonts.google.com/specimen/Poppins)): Licensed under SIL Open Font License 1.1
 
- **Roboto** ([Link](https://fonts.google.com/specimen/Roboto)): Licensed under Apache License 2.0

- **Tektur** ([Link](https://fonts.google.com/specimen/Tektur)): Licensed under SIL Open Font License 1.1
 
- **Ubuntu** ([Link](https://fonts.google.com/specimen/Ubuntu)): Licensed under Ubuntu Font License 1.0
 
- **Ubuntu Mono** ([Link](https://fonts.google.com/specimen/Ubuntu+Mono)): Licensed under Ubuntu Font License 1.0
 
Each license can be found in their respective folders in /fonts
