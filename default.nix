with import <nixpkgs> {};

let 
  rpath = with pkgs; lib.makeLibraryPath [
    nss
    atk
    zlib
    mesa
    glib
    gtk3
    nspr
    cups
    dbus
    expat
    cairo
    pango
    libpng
    libdrm
    systemd
    freetype
    alsa-lib
    fontconfig
    gdk-pixbuf
    xorg.libXi
    xorg.libX11
    xorg.libxcb
    at-spi2-core
    libxkbcommon
    xorg.libXext
    stdenv.cc.cc
    xorg.libXfixes
    xorg.libXrandr
    xorg.libXcursor
    xorg.libXdamage
    xorg.libXrender
    xorg.libXcomposite
  ];

  src = fetchurl {
      url = "https://github.com/Thaumy/Microsoft-ToDo-Electron/releases/download/v1.3.0/microsoft-todo-electron-1.3.0.tar.gz";
      sha256 = "1n3sbw2xc9dqz6drnmdbjvkx8zxls60xmjlmfs07zxhm2a2amlp5";
  };
in 
  stdenv.mkDerivation rec {
    name = "microsoft-todo-electron";

    phases = [ "unpackPhase" "installPhase" ];
    
    unpackPhase = ''
      mkdir unzipped
      tar -xvzf ${src} -C unzipped
    '';

    installPhase = ''
      cp -r unzipped/* $out
      patchelf --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" --set-rpath ${rpath}:$out $out/microsoft-todo-electron
      echo `ldd $out/microsoft-todo-electron | grep "not found"` # echo for debug.
    '';
  }
