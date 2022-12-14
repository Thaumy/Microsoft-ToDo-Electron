{ stdenv, pkgs, lib, fetchurl, makeDesktopItem }:

stdenv.mkDerivation rec {
  name = "microsoft-todo-electron";
  version = "1.3.1";

  phases = [ "unpackPhase" "installPhase" ];

  desktopItem = makeDesktopItem rec {
    name = "microsoft-todo-electron";
    desktopName = "ToDo";
    genericName = desktopName;
    comment = "Microsoft ToDo wrapped in Electron";

    exec = "${out}/${desktopName}";
    icon = "${out}/icon.icns";

    type = "Application";
  };

  rpath = with pkgs; lib.makeLibraryPath [
    atk
    nss
    nspr
    zlib
    glib
    gtk3
    mesa
    cups
    dbus
    expat
    cairo
    pango
    libpng
    libdrm
    systemd
    alsa-lib
    freetype
    gdk-pixbuf
    fontconfig
    xorg.libXi
    xorg.libX11
    xorg.libxcb
    xorg.libXext
    stdenv.cc.cc
    at-spi2-core
    libxkbcommon
    xorg.libXrandr
    xorg.libXfixes
    xorg.libXcursor
    xorg.libXrender
    xorg.libXdamage
    xorg.libXcomposite
  ];

  src = fetchurl {
    url = "https://github.com/Thaumy/Microsoft-ToDo-Electron/releases/download/v1.3.1/microsoft-todo-electron-1.3.1.tar.gz";
    sha256 = "";
  };
  
  unpackPhase = ''
    mkdir unzipped
    tar -xvzf ${src} -C unzipped
  '';

  installPhase = ''
    cp -r unzipped/* $out
    patchelf --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" --set-rpath ${rpath}:$out $out/microsoft-todo-electron
    ln -s ${desktopItem}/share/applications/* $out/share/applications
    echo `ldd $out/microsoft-todo-electron | grep "not found"` # echo for debug.
  '';
}
