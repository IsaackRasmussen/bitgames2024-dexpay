# Install script for directory: C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/windows/flutter/ephemeral/.plugin_symlinks/fast_rsa/windows

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "$<TARGET_FILE_DIR:dexpay-pos>")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(REMOVE_RECURSE "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/build/windows/x64/runner/Debug/librsa_bridge.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    file(REMOVE_RECURSE "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/build/windows/x64/runner/Profile/librsa_bridge.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(REMOVE_RECURSE "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/build/windows/x64/runner/Release/librsa_bridge.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/build/windows/x64/runner/Debug/librsa_bridge.dll")
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    file(INSTALL DESTINATION "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/build/windows/x64/runner/Debug" TYPE FILE FILES "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/windows/flutter/ephemeral/.plugin_symlinks/fast_rsa/windows/shared/librsa_bridge.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Pp][Rr][Oo][Ff][Ii][Ll][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/build/windows/x64/runner/Profile/librsa_bridge.dll")
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    file(INSTALL DESTINATION "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/build/windows/x64/runner/Profile" TYPE FILE FILES "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/windows/flutter/ephemeral/.plugin_symlinks/fast_rsa/windows/shared/librsa_bridge.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
     "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/build/windows/x64/runner/Release/librsa_bridge.dll")
    if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
      message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
    endif()
    file(INSTALL DESTINATION "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/build/windows/x64/runner/Release" TYPE FILE FILES "C:/Projects/Hackatons/bitgames2024-dexpay/dexpay-pos/windows/flutter/ephemeral/.plugin_symlinks/fast_rsa/windows/shared/librsa_bridge.dll")
  endif()
endif()

