{ pkgs ? import <nixpkgs> {} }:

let
  corepack = pkgs.stdenv.mkDerivation {
    name = "corepack";
    buildInputs = [ pkgs.nodejs-16_x ];
    phases = [ "installPhase" ];
    installPhase = ''
      mkdir -p $out/bin
      corepack enable --install-directory=$out/bin
    '';
  };
in pkgs.mkShell {
    packages = [
      corepack
      pkgs.nodejs-16_x
      pkgs.electron_18
    ];
#    nativeBuildInputs = [
#      pkgs.nodejs-16_x
#      pkgs.electron_18
#    ];
    ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/;
    ELECTRON_BUILDER_BINARIES_MIRROR=https://mirrors.huaweicloud.com/electron-builder-binaries/;
    ELECTRON_OVERRIDE_DIST_PATH = "${pkgs.electron_18}/bin/";
  }
