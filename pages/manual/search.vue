<template>
  <div>
    <v-container class="my-5">
      <h1 class="mb-5">{{ $t('manual') }} : {{ $t('検索画面') }}</h1>

      <h2 class="my-5">{{ $t('対象データ') }}</h2>

      <ul>
        <li>
          本データベースはGeorg Möller, <i>Hieratische Paläographie</i>, 4
          volumes, 1909–36.
          (以下、Möller字典と呼びます)に掲載されている字形リストを検索するシステムです．
        </li>
        <li>
          Möller字典の画像の元データには、東京大学アジア研究図書館デジタルライブラリーが<a
            href="https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/dres?sort_by=uparl%3AidentifierOfTheData&sort_order=asc"
            >Digital Resources for Egyptian Studies</a
          >にて提供するIIIF画像を使用しています．
        </li>
        <li>
          IIIF画像の切り出し及び表示には、人文学オープンデータ共同利用センターが提供する<a
            href="http://codh.rois.ac.jp/iiif/curation/"
            >Curation API</a
          >、<a href="http://codh.rois.ac.jp/software/iiif-curation-viewer/"
            >IIIF Curation Viewer</a
          >、<a href="http://codh.rois.ac.jp/iiif-curation-platform/"
            >IIIF Curation Platform</a
          >を使用しています．
        </li>
      </ul>

      <h2 class="my-5">{{ $t('検索画面') }}</h2>

      <v-img :src="baseUrl + '/img/icons/search.png'" width="100%" contain />

      <h3 class="my-5">[1] {{ $t('メニューバー') }}</h3>

      <p>「Home」、「検索」、「ユーザズガイド」等を選択することができます．</p>

      <h3 class="my-5">[2] {{ $t('全文検索') }}</h3>

      <p>
        サイト全体を検索します．対象範囲が広いので、以下の[4][5][6][7]の使用をお薦めします．
      </p>

      <h3 class="my-5">[3] {{ $t('language') }}</h3>

      <p>表示言語（英語/日本語）の切り替えを行うことができます．</p>

      <h3 class="my-5">[4] {{ $t('Vol') }}</h3>

      <p>Möller字典の巻数を指定することができます．</p>

      <h3 class="my-5">[5] {{ $t('Hieratic No') }}</h3>

      <p>
        ヒエラティック番号からヒエラティックを検索することができます．文字番号は原則としてMöller字典に記載されているものに従っています．ただし、一部の文字については独自に下位区分を与えています．ヒエラティック番号を入力して検索すると、下位区分を含めた結果が示されます．例えば、“192”で検索すると、“192,
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
        ただし、一部の文字については独自に補助記号を与えています．<br />
        ヒエログリフ番号による検索では、G17、Aa2など「アルファベット＋数字」を入力して下さい．アルファベットのみの入力ではデータがヒットしません．
      </p>

      <h3 class="my-5">[7] {{ $t('Phone/Word') }}</h3>

      <p>
        音価や単語からヒエラティックを検索することができます。検索では、<a
          href="http://www.catchpenny.org/codage/#trans"
          >Manuel de Codage（MdC）</a
        >方式によるアルファベット（半角、英、大文字、小文字）を入力して下さい．
        例えば、<span class="phone">Ax</span>を検索する際には、Axと入力することになります．
        なお、本データベースでは文字配列のための補助記号（:）(*）や形態素境界記号（.）(=)は使用しておりません．
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
