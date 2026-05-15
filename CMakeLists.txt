cmake_minimum_required(VERSION 3.16)
project(IronTunerProject LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(DISABLE_DEMOS ON CACHE BOOL "Disable engine demos" FORCE)

set(OHMFLUX_DIR "/opt/OhmFlux" CACHE PATH "Path to the OhmFlux engine source directory")


include(FetchContent)

if( ("${OHMFLUX_DIR}" STREQUAL "") OR (NOT EXISTS "${OHMFLUX_DIR}/CMakeLists.txt"))
    message(WARNING "The directory OHMFLUX_DIR='${OHMFLUX_DIR}' does not contain a CMakeLists.txt file! Fetching from github.")

    FetchContent_Declare(
        ohmFlux
        GIT_REPOSITORY https://github.com/ohmtal/OhmFlux
        GIT_TAG        main
    )
    set(DISABLE_DEMOS ON CACHE BOOL "Disable engine demos" FORCE)
    set(WITH_BOX2D OFF CACHE BOOL "Enable Box 2D : off" FORCE)
    FetchContent_MakeAvailable(ohmFlux)

    set(OHMFLUX_DIR ${ohmFlux_SOURCE_DIR})

else()
    add_subdirectory("${OHMFLUX_DIR}" "${CMAKE_BINARY_DIR}/ohmFlux_build")
endif()




# --- IronTuner ---
option(BUILD_IRONTUNER "Build IronTuner" ON)
# CURL(SSL) AND ANDROID IS NO FUN! ... later.... no idea how many hours i spend on it ...
#  FIXME enable internet on : android/app/src/main/AndroidManifest.xml


if(BUILD_IRONTUNER AND NOT EMSCRIPTEN)
    set(IRONTUNER_DIR "${CMAKE_CURRENT_LIST_DIR}/IronTuner")

   if(MSVC)
        set(RES_FILES
            "${IRONTUNER_DIR}/res/resources.rc"
            "${IRONTUNER_DIR}/res/app.manifest"
            )
   endif()



	if(FALSE AND MSVC)
		find_package(CURL REQUIRED)
		list(APPEND PROJECT_LIBS CURL::libcurl)
		message(STATUS "Added Curl .....")

	else ()



        # if (ANDROID)
        #     # set(CMAKE_POSITION_INDEPENDENT_CODE ON)
        #     # FetchContent_Declare(
        #     #     boringssl
        #     #     URL "${CMAKE_CURRENT_LIST_DIR}/lib/boringssl-0.20260327.0.tar.gz"
        #     #     DOWNLOAD_EXTRACT_TIMESTAMP FALSE
        #     # )
        #     #
        #     # FetchContent_MakeAvailable(boringssl)
        #     #
        #     # set(FAKE_LIB_PATH "${boringssl_SOURCE_DIR}/CMakeLists.txt")
        #     #
        #     # set(OPENSSL_FOUND TRUE CACHE BOOL "" FORCE)
        #     # set(OpenSSL_FOUND TRUE CACHE BOOL "" FORCE)
        #     #
        #     # set(OPENSSL_CRYPTO_LIBRARY "${FAKE_LIB_PATH}" CACHE FILEPATH "" FORCE)
        #     # set(OPENSSL_SSL_LIBRARY "${FAKE_LIB_PATH}" CACHE FILEPATH "" FORCE)
        #     #
        #     # set(OPENSSL_INCLUDE_DIR "${boringssl_SOURCE_DIR}/include" CACHE PATH "" FORCE)
        #     # set(OPENSSL_VERSION "1.1.1" CACHE STRING "" FORCE)
        #     # set(OPENSSL_IS_BORINGSSL ON CACHE BOOL "" FORCE)
        #     # set(CURL_USE_OPENSSL ON CACHE BOOL "" FORCE)
        #
        #     set(CURL_USE_OPENSSL OFF CACHE INTERNAL "")
        #
        # else()
        #     set(CURL_USE_OPENSSL ON CACHE INTERNAL "")
        # endif()

        # pre MSVC static BUILD >>>>>>>>
		# set(BUILD_CURL_EXE OFF CACHE INTERNAL "")
		# set(BUILD_EXAMPLES OFF CACHE INTERNAL "")
		# set(BUILD_TESTING OFF CACHE INTERNAL "")
		# set(BUILD_LIBCURL_DOCS OFF CACHE INTERNAL "")
		# set(BUILD_SHARED_LIBS OFF CACHE INTERNAL "")
		# set(CURL_USE_LIBPSL OFF CACHE INTERNAL "")
		# set(CURL_DISABLE_LDAP ON CACHE INTERNAL "")
		# set(CURL_DISABLE_LDAPS ON CACHE INTERNAL "")
		# set(HTTP_ONLY ON CACHE INTERNAL "") # i only need http at the moment !
		# <<<<<<<<<<<<<<<<
        set(CURL_STATIC_CRT ON CACHE INTERNAL "")

        set(HTTP_ONLY ON CACHE INTERNAL "")
        set(CURL_DISABLE_COOKIES ON CACHE INTERNAL "")
        set(CURL_DISABLE_ALTSVC ON CACHE INTERNAL "")
        set(CURL_DISABLE_HSTS ON CACHE INTERNAL "")
        set(CURL_DISABLE_MIME ON CACHE INTERNAL "")
        set(CURL_DISABLE_PARSEDATE ON CACHE INTERNAL "")

        set(CURL_USE_OPENSSL OFF CACHE INTERNAL "")
        set(CURL_USE_SCHANNEL OFF CACHE INTERNAL "")

        set(BUILD_CURL_EXE OFF CACHE INTERNAL "")
        set(BUILD_EXAMPLES OFF CACHE INTERNAL "")
        set(BUILD_TESTING OFF CACHE INTERNAL "")
        set(BUILD_LIBCURL_DOCS OFF CACHE INTERNAL "")
        set(BUILD_SHARED_LIBS OFF CACHE INTERNAL "")
        set(CURL_USE_LIBPSL OFF CACHE INTERNAL "")
        set(CURL_DISABLE_LDAP ON CACHE INTERNAL "")
        set(CURL_DISABLE_LDAPS ON CACHE INTERNAL "")


		FetchContent_Declare(
			curl
			URL "${OHMFLUX_DIR}/lib/curl-curl-8_19_0.tar.gz"
			DOWNLOAD_EXTRACT_TIMESTAMP FALSE
		)
		FetchContent_MakeAvailable(curl)

    if (ANDROID)
        # if(TARGET libcurl_static)
        #     target_link_libraries(libcurl_static PRIVATE ssl crypto)
        #     set_property(TARGET ssl PROPERTY EXPORT_NAME "ssl")
        #     set_property(TARGET crypto PROPERTY EXPORT_NAME "crypto")
        # endif()
        #
        # set(CURL_SKIP_INSTALL ON CACHE BOOL "" FORCE)
        # if(TARGET crypto)
        #     target_link_libraries(crypto INTERFACE log)
        # endif()

        # list(APPEND PROJECT_LIBS openssl z log)
    endif()


		list(APPEND PROJECT_LIBS libcurl)
  endif()



    set(IRONTUNER_SOURCES
        "${IRONTUNER_DIR}/src/main.cpp"
        "${IRONTUNER_DIR}/src/appMain.h"
        "${IRONTUNER_DIR}/src/appMain.cpp"
        "${IRONTUNER_DIR}/src/appGui.h"
        "${IRONTUNER_DIR}/src/appGui.cpp"
        "${IRONTUNER_DIR}/src/BackGroundEffects.h"
        "${IRONTUNER_DIR}/src/StationHandler.h"
        "${IRONTUNER_DIR}/src/StationHandler.cpp"
        "${IRONTUNER_DIR}/src/WindowState.h"

        # fluxRadio:
        "${IRONTUNER_DIR}/src/fluxRadio/AudioHandler.h"
        "${IRONTUNER_DIR}/src/fluxRadio/AudioHandler.cpp"
        "${IRONTUNER_DIR}/src/fluxRadio/AudioRecorder.h"
        "${IRONTUNER_DIR}/src/fluxRadio/AudioRecorder.cpp"
        "${IRONTUNER_DIR}/src/fluxRadio/StreamHandler.h"
        "${IRONTUNER_DIR}/src/fluxRadio/StreamHandler.cpp"
        "${IRONTUNER_DIR}/src/fluxRadio/RadioBrowser.h"
        "${IRONTUNER_DIR}/src/fluxRadio/RadioBrowser.cpp"
        "${IRONTUNER_DIR}/src/fluxRadio/RadioStation.h"
        "${IRONTUNER_DIR}/src/fluxRadio/RadioStation.cpp"
        "${IRONTUNER_DIR}/src/fluxRadio/StreamInfo.h"
        "${IRONTUNER_DIR}/src/fluxRadio/StreamInfo.cpp"
    )
    configure_project_target(IronTuner ${IRONTUNER_DIR} "${IRONTUNER_DIR}/assets@assets" "${IRONTUNER_SOURCES}" ${RES_FILES})

    if(MSVC)

        # Attempt to prevent false positives
        set_target_properties(IronTuner PROPERTIES
            INTERPROCEDURAL_OPTIMIZATION_RELEASE TRUE
        )

        set_property(TARGET IronTuner APPEND_STRING PROPERTY
          LINK_FLAGS_RELEASE " /HIGHENTROPYVA /DYNAMICBASE"
            # LINK_FLAGS_RELEASE " /LTCG /SECTION:.text,erw /ALIGN:4096"
        )

        set_property(TARGET IronTuner APPEND_STRING PROPERTY
            COMPILE_FLAGS " /Gy"
        )
        set_property(TARGET IronTuner APPEND_STRING PROPERTY
            LINK_FLAGS_RELEASE " /OPT:REF /OPT:ICF"
        )

        # target_link_options(IronTuner PRIVATE "/MANIFESTINPUT:${IRONTUNER_DIR}/res/app.manifest")
        # target_sources(IronTuner PRIVATE "${IRONTUNER_DIR}/res/app.manifest")
    endif()


elseif(BUILD_IRONTUNER)
    message(FATAL_ERROR "IRONTUNER: EMSCRIPTEN BUILD NOT AVAILABLE!")
endif()
