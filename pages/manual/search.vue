<template>
  <div>
    <v-container class="my-5">
      <h1 class="mb-5">{{ $t('manual') }} : {{ $t('検索画面') }}</h1>

      <h2 class="my-5">{{ $t('対象データ') }}</h2>

      <ul>
        <li>
          本データベースはGeorg Möller, <i>Hieratische Paläographie</i>, 4
          volumes, 1909–36.
          (以下、Möller字典と呼びます)の画像を検索するシステムです．
        </li>
        <li>
          画像データには、東京大学アジア研究図書館デジタルライブラリーが提供するIIIF画像を使用しています．
        </li>
      </ul>

      <h2 class="my-5">{{ $t('検索画面') }}</h2>

      <v-img :src="baseUrl + '/img/icons/search.png'" width="100%" contain />

      <h3 class="my-5">[1] {{ $t('メニューバー') }}</h3>

      <h3 class="my-5">[2] {{ $t('全文検索') }}</h3>

      <p>
        サイト全体を検索します．対象範囲が広いので、以下の[4][5][6][7]の使用をお薦めすます．
      </p>

      <h3 class="my-5">[3] {{ $t('言語切り替え（英語/日本語）') }}</h3>

      <h3 class="my-5">[4] {{ $t('巻数') }}</h3>

      <p>Möller字典の巻数を絞り込むことができます．</p>

      <h3 class="my-5">[5] {{ $t('ヒエラティック番号') }}</h3>

      <p>
        Möller字典に記載されている番号に従っています．ただし、一部の文字については独自に下位区分を与えています．ヒエラティック番号を入力して検索すると下位区分を含めた結果が示されます．例：“192”で検索すると、“192,
        192B, 192C”が示されます．
      </p>

      <h3 class="my-5">[6] {{ $t('ヒエログリフ番号') }}</h3>

      <p>
        本データベースで使用するヒエログリフ
        番号は以下の番号に従っています．ただし、一部の文字については独自に補助記号を与えています．
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
        ヒエログリフ番号による検索では、G1、Aa2など「アルファベット記号＋数字」を入力して下さい．アルファベット記号のみの入力ではデータがヒットしません．
      </p>

      <h3 class="my-5">[7] {{ $t('音価/語') }}</h3>

      <p>
        文字の音価や文字が使用されている語の子音転写記号で検索を行うことができます．子音転写記号には<a
          href="https://en.wikipedia.org/wiki/Manuel_de_Codage"
          >Manuel de Codage</a
        >方式の<a href="http://www.catchpenny.org/codage/#trans"
          >transliteration</a
        >（エジプト学式の翻字）を採用しています．ただし、文字配列のための補助記号（:）(*）や形態素境界記号（.）(=)は使用していません．検索では、transliterationの対応表にあるアルファベット（半角英、大文字/小文字）を入力します．
      </p>

      <h3 class="my-5">[8] {{ $t('ページ') }}</h3>

      <p>
        Möller字典の本文のページを指定することができます．指定できるのは特定の１ページのみとなります．
      </p>

      <h3 class="my-5">[9] {{ $t('順番') }}</h3>

      <p>
        Möller字典のページ内における文字種の配列順番を指定することができます．
      </p>

      <h3 class="my-5">[10] {{ $t('備考') }}</h3>

      <p>備考に記入された情報から検索することができます．</p>
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
