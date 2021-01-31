<template>
  <div>
    <v-container class="my-5">
      <h1 class="mb-5">{{ $t('manual') }} : {{ $t('検索画面') }}</h1>

      <h2 class="my-5">{{ $t('対象データ') }}</h2>

      <ul>
        <li>
          本データベースはGeorg Möller, <i>Hieratische Paläographie</i>, 3
          volumes, 1909–12.
          (以下，『ヒエラティック古書体学』と呼びます)に掲載されている字形リストを検索するシステムです．
        </li>
        <li>
          2021年1月31日現在，第1巻〜第3巻の基本字（1~613bis），数字類（614~719），連字（I~LXXVII）を収録しています．
        </li>
        <li>
          『ヒエラティック古書体学』の画像の元データには，東京大学アジア研究図書館デジタルライブラリーが<a
            href="https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/dres?sort_by=uparl%3AidentifierOfTheData&sort_order=asc"
            >Digital Resources for Egyptian Studies</a
          >にて提供するIIIF画像を使用しています．
        </li>
        <li>
          IIIF画像の切り出し及び表示には，人文学オープンデータ共同利用センターが提供する<a
            href="http://codh.rois.ac.jp/iiif/curation/"
            >Curation API</a
          >，<a href="http://codh.rois.ac.jp/software/iiif-curation-viewer/"
            >IIIF Curation Viewer</a
          >，<a href="http://codh.rois.ac.jp/iiif-curation-platform/"
            >IIIF Curation Platform</a
          >を使用しています．
        </li>
      </ul>

      <h2 class="my-5">{{ $t('検索画面') }}</h2>

      <v-img :src="baseUrl + '/img/icons/search.png'" width="100%" contain />

      <h3 class="my-5">[1] {{ $t('メニューバー') }}</h3>

      <p>
        「Home」，「検索」，「カテゴリー」，「ユーザズガイド」等を選択することができます．
      </p>

      <h3 class="my-5">[2] {{ $t('全文検索') }}</h3>

      <p>サイト全体を検索します．</p>

      <h3 class="my-5">[3] {{ $t('language') }}</h3>

      <p>表示言語（ENGLISH/日本語）の切り替えを行うことができます．</p>

      <h3 class="my-5">[4] {{ $t('Item Type') }}</h3>

      <p>
        基本字（1~613bis），連字（I~LXXVII），数字類（614~719）を選択することができます．
      </p>

      <h3 class="my-5">[5] {{ $t('Sub Type') }}</h3>

      <p>
        数字類（614~719）の下位分類として「数詞」，「日付」，「分数」，「尺」，「面積」，「体積」を選択することができます．
      </p>

      <h3 class="my-5">[6] {{ $t('Unit') }}</h3>

      <p>
        「単字」と「連字」を選択することができます．「単字」は文字が単独で使用されたものです．「連字」は２つ以上の文字が連続して書かれたものです．
      </p>

      <h3 class="my-5">[7] {{ $t('Item Label') }}</h3>

      <p>
        『ヒエラティック古書体学』に掲載されているアイテム番号（データの見出しとして使用されている番号）で検索します．アイテム番号を入力して検索すると，下位区分を含めた結果が示されます．例えば，“192”で検索すると，“192,
        192B, 192C”が示されます．
      </p>

      <ul>
        <li>
          <nuxt-link
            :to="
              localePath({
                name: 'category-id',
                params: { id: 'Item Label Mod' },
              })
            "
            >アイテム番号一覧</nuxt-link
          >
        </li>
      </ul>

      <h3 class="my-5">[8] {{ $t('Hieratic No') }}</h3>

      <p>
        ヒエラティック番号で検索することできます．ヒエラティックは原則としてアイテム番号と一致しています．ただし，一部のアイテムについては，名寄せ（統合）と名分け（分割）を行うなど，本サイトで独自に設定したものとなっています．
      </p>

      <ul>
        <li>
          <nuxt-link
            :to="
              localePath({
                name: 'category-id',
                params: { id: 'Hieratic No Mod' },
              })
            "
            >ヒエラティック番号一覧</nuxt-link
          >
        </li>
      </ul>

      <h3 class="my-5">[9] 分類クラス</h3>
      <p>
        ヒエログリフ番号に付されている分類クラスを絞り込むことができます．分類クラスとは，ヒエログリフ番号の最初に付されているアルファベットを言います．A〜Z（Jを除く），Aaの26種類となります．
      </p>

      <ul>
        <li>
          <nuxt-link
            :to="
              localePath({
                name: 'category-id',
                params: { id: 'Category Class' },
              })
            "
            >分類クラス一覧</nuxt-link
          >
        </li>
      </ul>

      <h3 class="my-5">[10] ヒエログリフ番号</h3>
      <p>
        ヒエログリフ番号からヒエラティックを検索することができます．本データベースで使用するヒエログリフ番号は以下の番号に従っています．
      </p>
      <ul>
        <li>
          <a href="https://en.wikipedia.org/wiki/Gardiner%27s_sign_list"
            >Gardiner's sign list._Wikipedia</a
          >
        </li>
        <li>
          <a
            href="https://hieroglyphes.pagesperso-orange.fr/Hieroglyphica = A.htm"
            >HIEROGLYPHICA</a
          >
        </li>
      </ul>

      <p class="mt-5">
        ただし，一部の文字については独自に補助記号を与えています．ヒエログリフ番号による検索では，G17，Aa2など「分類クラス（アルファベット）＋数字」を入力して下さい．分類クラス（アルファベット）のみの入力ではデータがヒットしません．
      </p>

      <ul>
        <li>
          <nuxt-link
            :to="
              localePath({
                name: 'category-id',
                params: { id: 'Hieroglyph No Mod' },
              })
            "
            >ヒエログリフ番号一覧</nuxt-link
          >
        </li>
      </ul>

      <h3 class="my-5">[11] {{ $t('Phone/Word') }}</h3>
      <p>
        音価や単語からヒエラティックを検索することができます．検索では，Manuel
        de
        Codage（MdC）方式によるアルファベット（半角，英，大文字，小文字）を入力して下さい．例えば，<span
          class="phone"
          >Ax</span
        >を検索する際には，Axと入力することになります．なお，本データベースでは文字配列のための補助記号（:）(*）や形態素境界記号（.）(=)は使用しておりません．子音転写の表示にはTransliterationフォントを使用しています．
      </p>
      <ul>
        <li>
          <a href="http://www.catchpenny.org/codage/#trans"
            >Manuel de Codage（MdC）</a
          >
        </li>

        <li>
          <a href="http://wwwuser.gwdg.de/~lingaeg/bin/glyph_i.zip"
            >True Type Font “Transliteration” (The Centre For Computer-aided
            Egyptological Research)</a
          >
        </li>
      </ul>

      <h3 class="my-5">[12] 数詞</h3>
      <p>数詞でヒエラティックを検索することができます．</p>
      <ul>
        <li>
          <nuxt-link
            :to="
              localePath({
                name: 'category-id',
                params: { id: 'Numeral' },
              })
            "
            >数詞一覧</nuxt-link
          >
        </li>
      </ul>

      <h3 class="my-5">[13] 巻数</h3>
      <p>『ヒエラティック古書体学』の巻数を指定することができます．</p>

      <h3 class="my-5">[14] ページ</h3>
      <p>
        『ヒエラティック古書体学』の本文のページを指定することができます．指定できるのは特定の１ページのみとなります．
      </p>
      <h3 class="my-5">[15] 順番</h3>
      <p>
        『ヒエラティック古書体学』のページ内における文字種の配列順番を指定することができます．
      </p>
      <h3 class="my-5">[16] 備考</h3>
      <p>備考に記入された情報を検索することができます．</p>

      <!--
      <h3 class="my-5">[4] {{ $t('Vol') }}</h3>

      <p>Möller字典の巻数を指定することができます．</p>

      <h3 class="my-5">[5] {{ $t('Hieratic No') }}</h3>

      <p>
        ヒエラティック番号からヒエラティックを検索することができます．文字番号は原則としてMöller字典に記載されているものに従っています．ただし，一部の文字については独自に下位区分を与えています．ヒエラティック番号を入力して検索すると，下位区分を含めた結果が示されます．例えば，“192”で検索すると，“192,
        192B, 192C”が示されます．
      </p>

      <h3 class="my-5">[6] {{ $t('Hieroglyph No') }}</h3>

      <p>
        ヒエログリフ番号からヒエラティックを検索することができます．本データベースで使用するヒエログリフ番号は以下の番号に従っています．
      </p>

      <ul class="mb-4">
        <li>
          <a href="https://en.wikipedia.org/wiki/Gardiner%27s_sign_list"
            >Gardiner's sign list._Wikipedia</a
          >
        </li>
        <li>
          <a
            href="https://hieroglyphes.pagesperso-orange.fr/Hieroglyphica = A.htm"
            >HIEROGLYPHICA</a
          >
        </li>
      </ul>

      <p>
        ただし，一部の文字については独自に補助記号を与えています．<br />
        ヒエログリフ番号による検索では，G17，Aa2など「アルファベット＋数字」を入力して下さい．アルファベットのみの入力ではデータがヒットしません．
      </p>

      <h3 class="my-5">[7] {{ $t('Phone/Word') }}</h3>

      <p>
        音価や単語からヒエラティックを検索することができます．検索では，<a
          href="http://www.catchpenny.org/codage/#trans"
          >Manuel de Codage（MdC）</a
        >方式によるアルファベット（半角，英，大文字，小文字）を入力して下さい．
        例えば，<span class="phone">Ax</span
        >を検索する際には，Axと入力することになります．
        なお，本データベースでは文字配列のための補助記号（:）(*）や形態素境界記号（.）(=)は使用しておりません．
      </p>

      <h3 class="my-5">[8] {{ $t('Page') }}</h3>

      <p>
        Möller字典の本文のページを指定することができます．指定できるのは特定の１ページのみとなります．
      </p>

      <h3 class="my-5">[9] {{ $t('Order') }}</h3>

      <p>
        Möller字典のページ内における文字種の配列順番を指定することができます．
      </p>

      <h3 class="my-5">[10] {{ $t('Note') }}</h3>

      <p>備考に記入された情報を検索することができます．</p>
      -->
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: process.env.BASE_URL,
    }
  },
  head() {
    const title = 'About'
    return {
      title,
    }
  },
}
</script>
