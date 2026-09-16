::: code-group

```sh [sudo]
sudo emerge --ask app-eselect/eselect-repository dev-vcs/git
sudo eselect repository add gentoo-zh git https://github.com/gentoo-zh/overlay.git
sudo emaint sync -r gentoo-zh
```

```sh [root]
emerge --ask app-eselect/eselect-repository dev-vcs/git
eselect repository add gentoo-zh git https://github.com/gentoo-zh/overlay.git
emaint sync -r gentoo-zh
```

:::

::: tip 已設定 overlay
如果已經設定 gentoo-zh，只需執行同步命令。映像選擇和手動設定方法見 [gentoo-zh overlay 文件](https://gentoozh.org/overlay/)。
:::
