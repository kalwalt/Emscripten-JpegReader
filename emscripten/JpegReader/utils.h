#ifndef UTILS_H
#define UTILS_H

#include <stdio.h>
#include <iostream>
#include <stdlib.h>
#include <string.h>

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

int arUtilDivideExt( const char *filename, char *s1, char *s2 )
{
    int   j, k;

    for(j=0;;j++) {
        s1[j] = filename[j];
        if( s1[j] == '\0' || s1[j] == '.' ) break;
    }
    s1[j] = '\0';
    if( filename[j] == '\0' ) s2[0] = '\0';
    else {
        j++;
        for(k=0;;k++) {
            s2[k] = filename[j+k];
            if( s2[k] == '\0' ) break;
        }
    }

    return 0;
}

int ar2UtilDivideExt ( const char *filename, char *s1, char *s2 )
{
    return arUtilDivideExt( filename, s1, s2 );
}

const char *arUtilGetFileNameFromPath(const char *path)
{
	char *sep;
#ifdef _WIN32
    char *sep1;
#endif

    if (!path) return (NULL);
    if (!*path) return (NULL);

	sep = strrchr((char*)path, '/');
#ifdef _WIN32
    sep1 = strrchr(path, '\\');
    if (sep1 > sep) sep = sep1;
#endif

	if (!sep) return (path);
	else return (sep + 1);
}

char *arUtilGetFileExtensionFromPath(const char *path, const int convertToLowercase)
{
    char *sep;
    size_t len;
    char *ret;
    int i;

    if (!path || !*path) return (NULL);

    sep = strrchr((char*)arUtilGetFileNameFromPath(path), '.');
    if (!sep) return (NULL);

    sep++; // Move past '.'
    if (!*sep) return (NULL);

    len = strlen(sep);
    ret = (char *)malloc(len + 1);
    if (!ret) {
        fprintf(stderr, "Out of memory.\n");
        return (NULL);
    }

    if (convertToLowercase) {
        for (i = 0; i < len; i++) ret[i] = tolower(sep[i]);
    } else {
        for (i = 0; i < len; i++) ret[i] = sep[i];
    }
    ret[i] = '\0';

    return (ret);
}

#endif