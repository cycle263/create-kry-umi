#!/bin/sh
VERSION=$(jq -c '.version' package.json)
len=${#VERSION}-2
VERSION=${VERSION:1:len}
ENVS=$(jq -c '.sentryEnv' package.json)

# 发布一个版本
function releaseAndConfirm() {
    sentry-cli releases new $VERSION -p delivery
    sentry-cli releases finalize $VERSION
}

# 关联git-commits
function commitIntegration() {
    sentry-cli releases set-commits $VERSION --auto
}

# 部署到某个环境
function deploy2envs() {
    len=${#ENVS}-2
    str=${ENVS:1:len}
    arr=(${str//,/ });
    for each in ${arr[*]}; do
        sentry-cli releases deploys $VERSION new -e $each
    done
}

function deploySentry() {
    releaseAndConfirm
    commitIntegration
    deploy2envs
}

case $1 in
"deploySentry")
    deploySentry
    ;;
"releaseAndConfirm")
    releaseAndConfirm
    ;;
"commitIntegration")
    commitIntegration
    ;;
"deploy2envs")
    deploy2envs
    ;;
*)
    echo deploySentry releaseAndConfirm commitIntegration deploy2envs
    ;;
esac
