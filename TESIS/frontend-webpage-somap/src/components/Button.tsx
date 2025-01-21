import React from 'react';
import { Button, ButtonProps } from '@mui/material';

const MinimalButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      {...props}
      sx={{
        fontWeight: '500',
        padding: '8px 16px', // Espaciado reducido para un diseño minimalista
        borderRadius: '4px', // Bordes suaves pero menos redondeados
        fontSize: '0.875rem', // Tamaño de fuente más compacto
        color: '#FFFFFF', // Texto blanco
        backgroundColor: '#D7263D', // Rojo principal (basado en tu paleta)
        boxShadow: 'none', // Sin sombras
        textTransform: 'none', // Evitar mayúsculas automáticas
        transition: 'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
        '&:hover': {
          backgroundColor: '#B71E2B', // Rojo más oscuro al hover
        },
        '&:active': {
          backgroundColor: '#900B1A', // Rojo más profundo al clic
          transform: 'scale(0.98)', // Sutil reducción al clic
        },
        '&:disabled': {
          backgroundColor: '#E0E0E0', // Color gris para botones deshabilitados
          color: '#A0A0A0', // Texto gris claro para deshabilitado
        },
        ...props.sx, // Permitir sobrescribir estilos
      }}
    >
      {props.children}
    </Button>
  );
};

export default MinimalButton;
