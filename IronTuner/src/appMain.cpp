//------------------------------------------------------------------------------
// Copyright (c) 2026 Thomas Hühn (XXTH)
// SPDX-License-Identifier: MIT
//------------------------------------------------------------------------------
// APP Main
//------------------------------------------------------------------------------
#include "appMain.h"
namespace IronTuner {

    //--------------------------------------------------------------------------
    bool AppMain::Initialize()
    {
        if (!Parent::Initialize()) return false;

        mAppGui = new AppGui();
        if (!mAppGui->Initialize())
            return false;

        mBackGroundEffects = new BackGroundEffects();
        if (!mBackGroundEffects->Initialize()) {
            SAFE_DELETE(mBackGroundEffects);
            mBackGroundEffects = nullptr;
        } else {
            mBackGroundEffects->setAnalyzer(mAppGui->getSpectrumAnalyzer());
            setBackGroundRenderId(getAppSettings().BackGroundRenderId, getAppSettings().BackGroundScanLines);
            dLog("Set background render id: %d, scanlines:%d",getAppSettings().BackGroundRenderId, getAppSettings().BackGroundScanLines );
        }

        return true;
    }
    //--------------------------------------------------------------------------
    void AppMain::Deinitialize()
    {
        if (mBackGroundEffects) {
            mBackGroundEffects->Deinitialize();
            SAFE_DELETE(mBackGroundEffects);
        }

        mAppGui->Deinitialize();
        SAFE_DELETE(mAppGui);

        Parent::Deinitialize();
    }
    //--------------------------------------------------------------------------
    void AppMain::onKeyEvent(SDL_KeyboardEvent event)
    {
        bool isKeyUp = (event.type == SDL_EVENT_KEY_UP);
        bool isAlt =  event.mod & SDLK_LALT || event.mod & SDLK_RALT;
        if (event.key == SDLK_F4 && isAlt  && isKeyUp)
            TerminateApplication();
        else
            mAppGui->onKeyEvent(event);


    }
    //--------------------------------------------------------------------------
    void AppMain::onEvent(SDL_Event event)
    {
        mAppGui->onEvent(event);
    }
    //--------------------------------------------------------------------------
    void AppMain::Update(const double& dt)
    {
        static uint16_t lowFPSCounter = 0;
        if (mAppGui ) {
            mAppGui->Update(dt);
            if (mBackGroundEffects && getAppSettings().BackGroundRenderId >= 0) {
                mBackGroundEffects->UpdateLevels(dt, mAppGui->getAudioLevels(), mAppGui->isStreamConnected());

                if (getMain()->getFPS() < 15 && gAppStatus.Visible  ) {
                    lowFPSCounter++;
                    static uint16_t threshold = 250;
                    if ( getMain()->getFPS() < 3 ) {
                        if (threshold < 1000) dLog("Very low fps (%d) detected - guess it's a wake up from sleep.", getFPS());
                        threshold = 1000;

                    } else {
                        threshold = 250;
                    }
                    if ( lowFPSCounter > threshold ) {
                        lowFPSCounter = 0;
                        if (mBackGroundEffects->mFragShaders.size() > getAppSettings().BackGroundRenderId) {
                            int newId = -1;
                            if ( mBackGroundEffects->mFragShaders[getAppSettings().BackGroundRenderId].isHighLoad ) {
                                newId = LOW_BACKGROUND_ID;
                                getAppSettings().ToasterDetected = true;
                            }
                            Log("Low FPS detected (%d)! switchting to background id %d", getFPS(), newId);
                            setBackGroundRenderId(newId);
                        }
                    }
                }
            }
        }
        Parent::Update(dt);
    }
    //--------------------------------------------------------------------------
    void AppMain::onDrawTopMost()
    {
        mAppGui->DrawGui();
    }
    //--------------------------------------------------------------------------
    void AppMain::onDraw() {
        if (mBackGroundEffects && getAppSettings().BackGroundRenderId >=0) {
            mBackGroundEffects->Draw();
        }  else {
            if (mAppGui && mAppGui->mBrushedMetalTex) {
                DrawParams2D dp;
                dp.image = mAppGui->mBrushedMetalTex;
                dp.imgId = 0;
                dp.x = getScreen()->getCenterX();
                dp.y = getScreen()->getCenterY();
                dp.z = 0.f;
                dp.w = getScreen()->getWidth();
                dp.h = getScreen()->getHeight();

                Render2D.drawSprite(dp);
            }
        }
    }
    //--------------------------------------------------------------------------
    void AppMain::setBackGroundRenderId(int id, bool enableScanLines){
        getAppSettings().BackGroundRenderId = id;
        if (id >= 0) {
            reloadBackGroundEffectsShader( id, enableScanLines );
        }
    }
    // -------------------------------------------------------------------------
    bool AppMain::reloadBackGroundEffectsShader(int id, bool scanLines){
        if (mBackGroundEffects) return mBackGroundEffects->LoadShader(id, scanLines);
        return false;
    }

};
