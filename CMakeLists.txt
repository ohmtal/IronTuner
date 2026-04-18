cmake_minimum_required(VERSION 3.16)
project(IncludeTestProject LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(DISABLE_DEMOS ON CACHE BOOL "Disable engine demos" FORCE)

set(OHMFLUX_DIR "/opt/OhmFlux" CACHE PATH "Path to the OhmFlux engine source directory")

# 2. Check if the variable is empty or the path doesn't exist
if("${OHMFLUX_DIR}" STREQUAL "")
    message(FATAL_ERROR
        "\n OHMFLUX_DIR is not set! "
        "\n Please provide the path to the engine using: "
        "\n cmake -B build -DOHMFLUX_DIR=/path/to/OhmFlux"
    )
endif()

if(NOT EXISTS "${OHMFLUX_DIR}/CMakeLists.txt")
    message(FATAL_ERROR "The directory OHMFLUX_DIR='${OHMFLUX_DIR}' does not contain a CMakeLists.txt file!")
endif()

add_subdirectory("${OHMFLUX_DIR}" "${CMAKE_BINARY_DIR}/ohmFlux_build")

# 3. Macro access
# If the macro is defined inside the engine's CMakeLists.txt,
# add_subdirectory already loaded it. You don't need to include it again.
# If it's in a separate file, include only that specific .cmake file:
# include("/opt/OhmFlux/cmake/my_macros.cmake")

# 4. Use the macro
# Ensure the source files (main.cpp) exist in the current directory
configure_project_target(OhmFluxTicTac "${CMAKE_CURRENT_SOURCE_DIR}/" "assets/" src/main.cpp)


# --- IronTuner ---
option(BUILD_IRONTUNER "Build IronTuner" ON)
# CURL(SSL) AND ANDROID IS NO FUN! ... later.... no idea how many hours i spend on it ...
#  FIXME enable internet on : android/app/src/main/AndroidManifest.xml


if(BUILD_IRONTUNER AND NOT EMSCRIPTEN)
    set(IRONTUNER_DIR "${CMAKE_CURRENT_LIST_DIR}/IronTuner")

	if(MSVC)
		find_package(CURL REQUIRED)
		list(APPEND PROJECT_LIBS CURL::libcurl)
		message(STATUS "Added Curl .....")

		set(RES_FILES "${IRONTUNER_DIR}/res/resources.rc")

	else ()



        if (ANDROID)
            # set(CMAKE_POSITION_INDEPENDENT_CODE ON)
            # FetchContent_Declare(
            #     boringssl
            #     URL "${CMAKE_CURRENT_LIST_DIR}/lib/boringssl-0.20260327.0.tar.gz"
            #     DOWNLOAD_EXTRACT_TIMESTAMP FALSE
            # )
            #
            # FetchContent_MakeAvailable(boringssl)
            #
            # set(FAKE_LIB_PATH "${boringssl_SOURCE_DIR}/CMakeLists.txt")
            #
            # set(OPENSSL_FOUND TRUE CACHE BOOL "" FORCE)
            # set(OpenSSL_FOUND TRUE CACHE BOOL "" FORCE)
            #
            # set(OPENSSL_CRYPTO_LIBRARY "${FAKE_LIB_PATH}" CACHE FILEPATH "" FORCE)
            # set(OPENSSL_SSL_LIBRARY "${FAKE_LIB_PATH}" CACHE FILEPATH "" FORCE)
            #
            # set(OPENSSL_INCLUDE_DIR "${boringssl_SOURCE_DIR}/include" CACHE PATH "" FORCE)
            # set(OPENSSL_VERSION "1.1.1" CACHE STRING "" FORCE)
            # set(OPENSSL_IS_BORINGSSL ON CACHE BOOL "" FORCE)
            # set(CURL_USE_OPENSSL ON CACHE BOOL "" FORCE)

            set(CURL_USE_OPENSSL OFF CACHE INTERNAL "")

        else()
            set(CURL_USE_OPENSSL ON CACHE INTERNAL "")
        endif()


		set(BUILD_CURL_EXE OFF CACHE INTERNAL "")
		set(BUILD_EXAMPLES OFF CACHE INTERNAL "")
		set(BUILD_TESTING OFF CACHE INTERNAL "")
		set(BUILD_LIBCURL_DOCS OFF CACHE INTERNAL "")
		set(BUILD_SHARED_LIBS OFF CACHE INTERNAL "")
		set(CURL_USE_LIBPSL OFF CACHE INTERNAL "")
		set(CURL_DISABLE_LDAP ON CACHE INTERNAL "")
		set(CURL_DISABLE_LDAPS ON CACHE INTERNAL "")
		set(HTTP_ONLY ON CACHE INTERNAL "") # i only need https at the moment !


		FetchContent_Declare(
			curl
			URL "${CMAKE_CURRENT_LIST_DIR}/lib/curl-curl-8_19_0.tar.gz"
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
    configure_demo_target(IronTuner ${IRONTUNER_DIR} "${IRONTUNER_DIR}/assets@assets" "${IRONTUNER_SOURCES}" ${RES_FILES})

elseif(BUILD_IRONTUNER)
    message(WARNING "CURL: EMSCRIPTEN BUILD IS NOT FIXED SO FAR!!")
endif()
