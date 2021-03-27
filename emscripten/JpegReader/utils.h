#ifndef UTILS_H
#define UTILS_H

#include <stdio.h>
#include <iostream>
#include <stdlib.h>

inline int arUtilRemoveExt( char *filename )
{
    int   i, j;

    j = -1;
    for( i = 0; filename[i] != '\0'; i++ ) {
        if( filename[i] == '.' ) j = i;
    }
    if( j != -1 ) filename[j] = '\0';

    return 0;
}
#endif