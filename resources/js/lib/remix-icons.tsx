import React from 'react';
import { 
    Truck, Users, ArrowUpDown, ArrowUp, ArrowDown, Home, Building, Archive, 
    Sunrise, Sun, Sunset, AlertTriangle, Package, Shield, Wrench, Box, 
    Package2, Scissors, Layers, Container, BookOpen, Shirt
} from 'lucide-react';

// Dynamic icon mapping - maps icon names from widget config to Lucide React components
export const iconMap: Record<string, React.ComponentType<any>> = {
    // Moving & Transport
    'Truck': Truck,
    'truck': Truck,
    
    // People & Users  
    'Users': Users,
    'users': Users,
    'User': Users,
    'user': Users,
    
    // Arrows & Movement
    'ArrowUpDown': ArrowUpDown,
    'ArrowUp': ArrowUp,
    'ArrowDown': ArrowDown,
    'arrowupdown': ArrowUpDown,
    'arrowup': ArrowUp,
    'arrowdown': ArrowDown,
    
    // Buildings & Places
    'Home': Home,
    'home': Home,
    'Building': Building,
    'building': Building,
    'Archive': Archive,
    'archive': Archive,
    
    // Time & Weather
    'Sunrise': Sunrise,
    'sunrise': Sunrise,
    'Sun': Sun,
    'sun': Sun,
    'Sunset': Sunset,
    'sunset': Sunset,
    
    // Alerts & Status
    'AlertTriangle': AlertTriangle,
    'alerttriangle': AlertTriangle,
    'Alert': AlertTriangle,
    'alert': AlertTriangle,
    
    // Services & Tools
    'Package': Package,
    'package': Package,
    'Shield': Shield,
    'shield': Shield,
    'Wrench': Wrench,
    'wrench': Wrench,
    'Tool': Wrench,
    'tool': Wrench,
    
    // Moving Supplies
    'Box': Box,
    'box': Box,
    'Package2': Package2,
    'package2': Package2,
    'Scissors': Scissors,
    'scissors': Scissors,
    'Layers': Layers,
    'layers': Layers,
    'Container': Container,
    'container': Container,
    'BookOpen': BookOpen,
    'bookopen': BookOpen,
    'Shirt': Shirt,
    'shirt': Shirt,
    'Clothes': Shirt,
    'clothes': Shirt,
    
    // Additional aliases for supplies
    'boxes': Box,
    'packing': Package2,
    'bubble-wrap': Layers,
    'wardrobe': Shirt,
    'supplies': Package,
};

export const getIcon = (iconName: string | null | undefined) => {
    if (!iconName) return null;
    
    // Try exact match first
    const IconComponent = iconMap[iconName];
    
    if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found in icon map. Available icons:`, Object.keys(iconMap));
        return null;
    }
    
    return IconComponent;
};