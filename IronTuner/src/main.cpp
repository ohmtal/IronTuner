//-----------------------------------------------------------------------------
// Irön Tuner
//-----------------------------------------------------------------------------
#include <SDL3/SDL_main.h> //<<< Android! and Windows
#include "appMain.h"
//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

IronTuner::AppMain* gAppMain = nullptr;

IronTuner::AppMain* getGame() {
    return gAppMain;
}
IronTuner::AppMain* getMain() {
    return gAppMain;
}

int main(int argc, char* argv[])
{
    (void)argc; (void)argv;


    // set the frames - on ubuntu a higher frame is required than on other system
    // if (isAndroidBuild()) SDL_SetHint(SDL_HINT_AUDIO_DEVICE_SAMPLE_FRAMES, "2048");
    // else SDL_SetHint(SDL_HINT_AUDIO_DEVICE_SAMPLE_FRAMES, /*"8192"*/ /*"2048" */ "4096");

    // did run well on arch/android/freebsd but then i tested on ubuntu ^^
    SDL_SetHint(SDL_HINT_AUDIO_DEVICE_SAMPLE_FRAMES, "2048");


    // ~~~~~ background playing on android ~~~~~
    SDL_SetHint(SDL_HINT_ANDROID_BLOCK_ON_PAUSE, "0");


    IronTuner::AppMain* app = new IronTuner::AppMain();
    app->mSettings.Company = "Ohmtal";
    app->mSettings.Caption = "Irön Tuner";
    app->mSettings.Version = "0.260610";
    app->mSettings.enableLogFile   = true;
    app->mSettings.WindowMaximized = false;
    app->mSettings.ScreenWidth  = 1152; // 1920;
    app->mSettings.ScreenHeight =  648; //1080;
    app->mSettings.minWindowSize = {540,300};
    app->mSettings.IconFilename = "assets/icon64.bmp";

    app->mSettings.FullScreen = isAndroidBuild();
    app->mSettings.PauseMainThreadOnWindowMinimized = true;

    // Cursor
    // app->mSettings.CursorFilename = "assets/particles/BloodHand.bmp";
    // app->mSettings.cursorHotSpotX = 10;
    // app->mSettings.cursorHotSpotY = 10;




    gAppMain = app;



    app->Execute();
    SAFE_DELETE(app);
    return 0;
}


