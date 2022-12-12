with import <nixpkgs> {};

let 
  dep = with pkgs; [
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
    ffmpeg
    libpng
    libdrm
    systemd
    freetype
    alsa-lib
    libgcrypt
    libnotify
    fontconfig
    gdk-pixbuf
    xorg.libSM
    xorg.libXi
    xorg.libX11
    xorg.libICE
    xorg.libxcb
    at-spi2-atk
    at-spi2-core
    libxkbcommon
    xorg.libXext
    xorg.libXtst
    stdenv.cc.cc
    libpulseaudio
    xorg.libXfixes
    xorg.libXrandr
    curlWithGnuTls
    xorg.libXcursor
    xorg.libXdamage
    xorg.libXrender
    xorg.libxshmfence
    xorg.libXScrnSaver
    xorg.libXcomposite
  ];
  rpath = lib.makeLibraryPath dep;
in 
  stdenv.mkDerivation rec {
    name = "microsoft-todo-electron";
    env = buildEnv { name = name; paths = buildInputs; };
    buildInputs = with pkgs; [
      patchelf 
    ];

    phases = [ "unpackPhase" "installPhase" ];
    unpackPhase = ''
      echo $stdenv
    '';
    installPhase = ''
      echo `pwd`
      cp -r /home/thaumy/dev/repo/Microsoft-ToDo-Electron/dist/linux-unpacked $out/
      cp -r dist/linux-unpacked $out/
      patchelf --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" --set-rpath ${rpath} $out/microsoft-todo-electron
    '';
  }
