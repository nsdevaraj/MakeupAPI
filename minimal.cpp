#include "stasm_lib.h"
#include "opencv/highgui.h"
#include "stasm.h"
#include <iostream>
#include <fstream>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <stdarg.h>
using namespace std;
CvPoint pt[125];
string addData( int z, char* tempx, char* tempy, char* tempi, CvPoint pnt, string header)
{
	string data;
	pnt = pt[z];
	sprintf(tempx,"%d",pnt.x);
	sprintf(tempy,"%d",pnt.y);
	sprintf(tempi,"%d",z);
	data += "	<";
	data += header;
	data += " POSITION=\"";
	data +=tempi;
	data +="\" X=\"";
	data += tempx;
	data += "\" Y=\"";
	data += tempy;
	data += "\"/>";
	data += "\n";
	return data;
}
string appendData(int startIndex, int EndIndex, string header){
	string data;
	CvPoint pnt;
	char tempy[10];
	char tempx[10];
	char tempi[10];
	for(int z=startIndex;z<=EndIndex;z++){
		data+=addData(z, tempx, tempy, tempi, pnt, header);
	}
	return data;
}
string appendMultiData( int Count, string header, ... )
{
    string data;
    CvPoint pnt;
    char tempy[10];
    char tempx[10];
    char tempi[10];
    va_list Numbers;
    va_start(Numbers, Count);
    for(int i = 0; i < Count; ++i ){
        int z = va_arg(Numbers, int);
        data+=addData(z, tempx, tempy, tempi, pnt, header);
    }
    va_end(Numbers);
    return data;
}
string createData(){
	string data;
	data += appendData(54,54,"NOSERINGLEFT");
	data += appendData(58,58,"NOSERINGRIGHT");
	data += appendMultiData(2,"NECKLACE",110,111);
    
	data += appendData(0,12,"FACE");
	data += appendData(84,84,"FACE");
	data += appendData(13,15,"FACE");
	data += appendData(86,86,"FACE");
	data += appendData(16,21,"RIGHREYEBROW");
	data += appendData(22,27,"LEFTEYEBROW");
	data += appendData(40,47,"LEFTEYE");
	data += appendData(30,37,"RIGHTEYE");
	data += appendData(48,48,"NOSE");
	data += appendData(54,58,"NOSE");
	data += appendData(50,50,"NOSE");
    
	data += appendMultiData(2,"GLOSS",21,15);
	data += appendData(59,65,"LIPS");
	data += appendData(72,76,"LIPS");
	data += appendMultiData(3,"HAIR",14,12,0);
    
	data += appendData(01,01,"EARRINGLEFT");
	data += appendData(11,11,"EARRINGRIGHT");
	data += appendData(87,87,"BINDI");
	data += appendData(40,46,"LEFTEYELINER");
	data += appendData(30,36,"RIGHTEYELINER");
    data += appendData(10,11,"LEFTCHEEK");
	data += appendData(102,102,"LEFTCHEEK");
	data += appendData(108,108,"LEFTCHEEK");
	data += appendData(01,02,"RIGHTCHEEK");
	data += appendData(109,109,"RIGHTCHEEK");
	data += appendData(103,103,"RIGHTCHEEK");
    
	data += appendMultiData(5,"EYESHADOWHIGHLIGHTLEFT",26,21,98,100,102);
	data += appendMultiData(7,"EYESHADOWCONTOURLEFT",106,25,26,21,102,100,98);
	data += appendMultiData(7,"EYESHADOWLIDLEFT",106,98,100,102,104,28,96);
	data += appendMultiData(5,"EYESHADOWHIGHLIGHTRIGHT",99,101,103,15,20);
	data += appendMultiData(7,"EYESHADOWCONTOURRIGHT",107,99,101,103,15,20,19);
	data += appendMultiData(7,"EYESHADOWLIDRIGHT",97,107,99,101,103,105,33);
    
    data += appendData(34,37,"CONCEALERLEFT");
    data += appendData(30,30,"CONCEALERLEFT");
	data += appendMultiData(4,"CONCEALERLEFT",90,92,94,96);
    
    data += appendData(44,47,"CONCEALERRIGHT");
    data += appendData(40,40,"CONCEALERRIGHT");
	data += appendMultiData(4,"CONCEALERRIGHT",91,93,95,97);
    
	data += appendData(100,100,"SMOKEYEYELEFT");
	data += appendData(18,20,"SMOKEYEYELEFT");
	data += appendData(98,98,"SMOKEYEYELEFT");
	data += appendData(30,34,"SMOKEYEYELEFT");
	data += appendData(101,101,"SMOKEYEYERIGHT");
	data += appendData(25,27,"SMOKEYEYERIGHT");
	data += appendData(99,99,"SMOKEYEYERIGHT");
	data += appendData(40,44,"SMOKEYEYERIGHT");
    
	data += appendData(59,59,"LOWERLIPS");
	data += appendData(69,71,"LOWERLIPS");
	data += appendData(65,65,"LOWERLIPS");
	data += appendData(72,75,"LOWERLIPS");
    data += appendData(59,59,"LOWERLIPS");
	data += appendData(59,68,"UPPERLIPS");
	data += appendData(59,65,"LIPLINERUPPER");
	data += appendData(65,65,"LIPLINERLOWER");
	data += appendData(72,75,"LIPLINERLOWER");
	data += appendData(59,59,"LIPLINERLOWER");
	data += appendData(40,44,"EYELINERUPPERLEFT");
	data += appendData(44,47,"EYELINERLOWERLEFT");
	data += appendData(40,40,"EYELINERLOWERLEFT");
	data += appendData(30,34,"EYELINERUPPERRIGHT");
	data += appendData(30,37,"EYELINERLOWERRIGHT");
	data += appendData(30,30,"EYELINERLOWERRIGHT");
	return data;
}
void assignPoint(int PtIndex, CvPoint point){
	pt[PtIndex].x=point.x;
	pt[PtIndex].y=point.y;
}
void findNecklacePoints(){
	CvPoint nec1,nec2;
	//Necklace compute height
	int diffneckx=pt[7].x-pt[3].x;
	int diffnecky=pt[11].x-pt[7].x;
	nec1.x=pt[3].x;
	nec1.y=pt[3].y+diffneckx;
	nec2.x=pt[11].x;
	nec2.y=pt[11].y+diffnecky;
	//assign points
	assignPoint(110,nec1);
	assignPoint(111,nec2);
}
void findRightCheekBlushPoints(){
	CvPoint ptr1,ptr2;
	ptr1.x=abs((pt[43].x+pt[12].x)/2);
	ptr1.y=pt[12].y;
	ptr2.x=abs((pt[43].x+pt[13].x)/2);
	ptr2.y=pt[13].y;
	int diffcheekr=(int)ceil((float)(pt[12].y-pt[13].y)/4);
	ptr1.x=ptr1.x-diffcheekr;
	ptr1.y=ptr1.y-diffcheekr;
	ptr2.x=ptr2.x-diffcheekr;
	ptr2.y=ptr2.y-diffcheekr;
	//assign points
	assignPoint(76,ptr1);
	assignPoint(77,ptr2);
	pt[79].x=pt[12].x-diffcheekr;pt[79].y=pt[12].y;
	pt[78].x=pt[13].x-diffcheekr;pt[78].y=pt[13].y;
}
void findLeftCheekBlushPoints(){
	CvPoint ptl1,ptl2;
	ptl1.x=abs((pt[39].x+pt[2].x)/2);
	ptl1.y=pt[2].y;
	ptl2.x=abs((pt[39].x+pt[1].x)/2);
	ptl2.y=pt[1].y;
	int diffcheekl=(int)ceil((float)(pt[2].y-pt[1].y)/4);
	ptl1.x=ptl1.x+diffcheekl;
	ptl1.y=ptl1.y-diffcheekl;
	ptl2.x=ptl2.x+diffcheekl;
	ptl2.y=ptl2.y-diffcheekl;
	//assign points
	assignPoint(80,ptl1);
	assignPoint(81,ptl2);
	pt[83].x=pt[2].x+diffcheekl;pt[83].y=pt[2].y;
	pt[82].x=pt[1].x+diffcheekl;pt[82].y=pt[1].y;
}
void findHeadOutlinePoints(){
    int diffheadr=(int)ceil((float)(pt[12].y-pt[13].y)/2);
	int diffheadl=(int)ceil((float)(pt[0].y-pt[15].y)/2);
	int diffheadxr=(int)ceil((float)(pt[12].x+pt[13].x)/2);
	int diffheadxl=(int)ceil((float)(pt[0].x+pt[15].x)/2);
	CvPoint ptrh,ptlh;
	int diffheadrh=diffheadr;
	int diffheadlh=diffheadl;
	ptrh.x=diffheadxr+diffheadrh/4;
	ptrh.y=pt[13].y+diffheadrh;
	ptlh.x=diffheadxl-diffheadlh/4;
	ptlh.y=pt[15].y+diffheadlh;
	//assign points
	assignPoint(86,ptlh);
	assignPoint(84,ptrh);
}
void findBindiPoints(){
	CvPoint bindi;
	bindi.x=pt[14].x;
	bindi.y=(int)ceil((float)(pt[14].y+pt[17].y)/2);
	//assign points
	assignPoint(87,bindi);
}
void findEarPoints(){
	CvPoint rear,lear;
	int diffearl=(int)ceil((float)(pt[2].y-pt[1].y)/4);
	int diffearr=(int)ceil((float)(pt[12].y-pt[13].y)/4);
	lear.x=pt[0].x-diffearl*4/3;
	lear.y=pt[1].y;
	rear.x=pt[14].x+diffearr*4/3;
	rear.y=pt[13].y;
	//assign points
	assignPoint(88,lear);
	assignPoint(89,rear);
}
void findEyeConcealerPoints(){
	CvPoint rec1,rec2,rec3,lec1,lec2,lec3,lec4,rec4;
    int diffy = (pt[30].x-pt[37].x);
	lec1.x=pt[37].x;
	lec1.y=pt[37].y+diffy;
	rec1.x=pt[47].x;
	rec1.y=pt[47].y+diffy;
	lec2.x=pt[36].x;
	rec2.x=pt[46].x;
	lec2.y=pt[36].y+diffy;
	rec2.y=pt[46].y+diffy;
	lec3.x=pt[35].x;
	rec3.x=pt[45].x;
	lec3.y=pt[35].y+diffy;
	rec3.y=pt[45].y+diffy;
	lec4.x=pt[34].x-diffy;
	rec4.x=pt[44].x+diffy;
	lec4.y=pt[34].y+diffy;
	rec4.y=pt[44].y+diffy;
	//assign points
	assignPoint(90,lec1);
	assignPoint(91,rec1);
	assignPoint(92,lec2);
	assignPoint(93,rec2);
	assignPoint(94,lec3);
	assignPoint(95,rec3);
	assignPoint(96,lec4);
	assignPoint(97,rec4);
}
void findEyeHighlighterPoints(){
	CvPoint leh1,leh2,reh1,reh2,leh3,reh3,leh4,reh4;
    int diffy =(int)ceil((float)(pt[36].y-pt[38].y)*2);
	leh1.y=(int)ceil((float)(pt[21].y+pt[30].y)/2);
	reh1.y=(int)ceil((float)(pt[22].y+pt[40].y)/2);
	leh1.x=pt[21].x;
	reh1.x=pt[22].x;
	leh2.y=(int)ceil((float)(pt[18].y+pt[34].y)/2);
	reh2.y=(int)ceil((float)(pt[25].y+pt[44].y)/2);
	leh2.x=pt[18].x;
	reh2.x=pt[25].x;
	leh3.y=pt[93].y+diffy;
	reh3.y=pt[92].y+diffy;
	leh3.x=pt[93].x;
	reh3.x=pt[92].x;
    leh4.x=pt[65].x;
	reh4.x=pt[59].x;
    leh4.y=pt[54].y;
	reh4.y=pt[58].y;
	//assign points
	assignPoint(98,leh1);
	assignPoint(99,reh1);
	assignPoint(100,leh2);
	assignPoint(101,reh2);
	assignPoint(102,leh3);
	assignPoint(103,reh3);
	assignPoint(108,leh4);
	assignPoint(109,reh4);
}
void findEyeLidsPoints(){
	CvPoint elidl1,elidr1;
	elidl1.x=pt[21].x;
	elidr1.x=pt[15].x;
	elidl1.y=pt[28].y;
	elidr1.y=pt[33].y;
	//assign Points
	assignPoint(104,elidl1);
	assignPoint(105,elidr1);
}
void findEyeContourPoints(){
	CvPoint econl1,econr1;
	econl1.x=pt[24].x;
	econl1.y=(pt[24].y+pt[96].y)/2;//Needs Eye Concealer Points
	econr1.x=pt[18].x;
	econr1.y=(pt[97].y+pt[18].y)/2;//Needs Eye Concealer Points
	//assignPoints
	assignPoint(106,econl1);
	assignPoint(107,econr1);
}
void computePoints(){
	findNecklacePoints();
	findRightCheekBlushPoints();
	findLeftCheekBlushPoints();
	findHeadOutlinePoints();
	findBindiPoints();
	findEarPoints();
	findEyeConcealerPoints();
	findEyeHighlighterPoints();
	findEyeLidsPoints();
    findEyeContourPoints();
}
int main(int nNumberofArgs, char* pszArgs[])
{
	const char *sImage=pszArgs[1];
	const char *sXML=pszArgs[2];
	const char *sUniqueid=pszArgs[3];
	const char *sFBsrc=pszArgs[4];
	static const char* const path = pszArgs[1];
	float landmarks[500];
    cv::Mat_<unsigned char> img(cv::imread(path, CV_LOAD_IMAGE_GRAYSCALE));
    if (!img.data)
    {
        printf("Cannot load %s\n", path);
        exit(1);
    }
	int foundface;
    
	if (!stasm_search_single(&foundface, landmarks, (const char*)img.data, img.cols, img.rows, path, "../data"))
    {
        printf("Error in stasm_search_single: %s\n", stasm_lasterr());
        exit(1);
    }
    
    if (!foundface){
        printf("\nError: Cannot locate landmarks in %s\n", sImage);
        string errordata;
        errordata +="<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        errordata += "\n";
        errordata +="<FACIAL>";
        errordata += "\n";
        errordata += "<id>0</id>";
        errordata += "\n";
        errordata += "	<ERROR INFO=\"NO FACE FOUND ERROR\"/>";
        errordata += "\n";
        errordata += "</FACIAL>";
        ofstream myerrorfile;
        myerrorfile.open (sXML);
        myerrorfile << errordata;
        myerrorfile.close();
        return 0;
	}
    else
    {
        for (int i = 0; i < stasm_NLANDMARKS; i++){
            CvPoint temp;
            temp.x=landmarks[2 * i];
            temp.y=landmarks[2 * i + 1];
            pt[i]=temp;
        }
    }
	computePoints();
	// XML File Generation
	string data;
	data +="<?xml version=\"1.0\" encoding=\"utf-8\"?>";
	data += "\n";
	data +="<FACIAL>";
	data += "\n";
	data += "<uid>";
	data += sUniqueid;
	data += "</uid>";
	data += "<id>";
	data += sFBsrc;
	data += "</id>";
	data += "\n";
	data += createData();
	data += "</FACIAL>";
	ofstream myfile;
	myfile.open (sXML);
	myfile << data;
	myfile.close();
	return 0;
}
