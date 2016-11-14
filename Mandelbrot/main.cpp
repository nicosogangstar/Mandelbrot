#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <iostream>
#include <iomanip>
#include <fstream>
#include <GL/freeglut.h>

using namespace std;

void render(void);

int main(int argc, char** argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DEPTH | GLUT_DOUBLE | GLUT_RGBA);
	glutInitWindowPosition(100, 100);
	glutInitWindowSize(640, 400);
	glutCreateWindow("Mandelbrot");

	glutDisplayFunc(render);

	glutMainLoop();
	return 0;
}

void render()
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	glBegin(GL_TRIANGLES);
	glVertex2f(-0.5, -0.5);
	glVertex2f(0.5, 0);
	glVertex2f(0, 0.5);
	glEnd();

	glutSwapBuffers();
}

// I did not write these
#pragma region Shader Functions
unsigned long getFileLength(ifstream& file)
{
	if (!file.good()) return 0;

	unsigned long pos = file.tellg();
	file.seekg(0, ios::end);
	unsigned long len = file.tellg();
	file.seekg(ios::beg);

	return len;
}

int loadshader(char* filename, char** ShaderSource, unsigned long len)
{
	ifstream file;
	file.open(filename, ios::in); // opens as ASCII!
	if (!file) return -1;

	len = getFileLength(file);

	if (len == 0) return -2;   // Error: Empty File 

	*ShaderSource = new char[len + 1];
	if (*ShaderSource == 0) return -3;   // can't reserve memory
	*ShaderSource[len] = 0;

	unsigned int i = 0;
	while (file.good())
	{
		*ShaderSource[i] = file.get();       // get character from file.
		if (!file.eof())
			i++;
	}

	*ShaderSource[i] = 0;  // 0-terminate it at the correct position

	file.close();

	return 0; // No Error
}


void unloadshader(GLubyte** ShaderSource)
{
	if (*ShaderSource != 0)
		delete[] * ShaderSource;
	*ShaderSource = 0;
}

#pragma endregion
