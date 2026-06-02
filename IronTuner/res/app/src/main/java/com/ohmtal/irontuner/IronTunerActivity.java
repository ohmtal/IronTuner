package com.ohmtal.irontuner;

import android.content.Intent;
import androidx.core.content.ContextCompat;
import org.libsdl.app.SDLActivity;
import android.os.Build;
import android.os.Bundle;
import android.Manifest;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;


public class IronTunerActivity extends SDLActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
        }
    }

    // // really quit app on wipe close
    // @Override
    // public void onTaskRemoved(Intent rootIntent) {
    //     stopSdlForegroundService();
    //     super.onTaskRemoved(rootIntent);
    //     android.os.Process.killProcess(android.os.Process.myPid());
    //     System.exit(0);
    // }


    public void updateNotificationFromCpp(String text) {
        Intent intent = new Intent(this, IronTunerService.class);
        intent.putExtra("update_text", text);
        this.startService(intent);
    }



    public void startSdlForegroundService() {
        Intent serviceIntent = new Intent(this, IronTunerService.class);
        ContextCompat.startForegroundService(this, serviceIntent);
    }

    public void stopSdlForegroundService() {
        Intent serviceIntent = new Intent(this, IronTunerService.class);
        stopService(serviceIntent);
    }

}
