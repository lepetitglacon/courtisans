<script setup lang="ts">
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
</script>

<template>

  <div class="container-fluid">
    <div class="container">

      <div class="alert alert-primary mt-5" role="alert">
        <p>
          Les règles énnoncées sont celles du jeu de plateau.
          <br>Certaines règles sont modifiées dans la version navigateur
        </p>
      </div>

      <div class="row mt-5">
        <div class="col">
          <h2>Présentation et but du jeu</h2>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <p>Dans Courtisans vous recevez et jouez 3 cartes à chacun
            de vos tours. L'une d'elles est jouée à la table de la Reine,
            pour influencer positivement ou négativement le statut
            d'une famille. Les deux autres sont jouées chez vous et
            chez un adversaire et font gagner ou perdre des points,
            en fonction du statut de leur famille. Choisissez bien
            comment répartir vos 3 cartes si vous souhaitez terminer
            la partie avec le plus de points et l'emporter.</p>
        </div>
        <div class="col"></div>
      </div>

      <div class="row"><h2>Mise en place</h2></div>
      <div class="row mb-5">
        <div class="col">
          <p>
            Placez le plateau de jeu au centre de la table.
            Mélangez toutes les cartes Courtisan, sans les
            regarder. Écartez des cartes au hasard, selon
            le nombre de joueurs, sans les révéler.
          </p>
          <ul>
            <li>A 2 joueurs, écartez 30 cartes (il reste 60 cartes dans la pioche)</li>
            <li>A 3 joueurs, écartez 18 cartes (il reste 72 cartes dans la pioche)</li>
            <li>A 4 joueurs, écartez 6 cartes (il reste 84 cartes dans la pioche)</li>
            <li>A 5 joueurs, n'écartez aucune carte, vous jouez avec la pioche complète</li>
          </ul>
        </div>
        <div class="col">
          <p>
            Distribuez 3 cartes Courtisan, face cachée, à chacun
            des joueurs. Tout le monde prend connaissance de ses
            cartes, sans les dévoiler. Placez les cartes Courtisan
            restantes en une pioche face cachée, à proximité
            du plateau de jeu.
          </p>
          <p>
            Distribuez ensuite 2 cartes Mission face cachée
            à tous les joueurs. Chacun en prend connaissance
            secrètement et les conserve près de lui. Remettez
            les autres cartes Mission dans la boite, sans
            les regarder. Elles ne seront pas utilisées pour la partie.
            Il est possible de regarder ses cartes Mission
            à n'importe quel moment du jeu mais il ne faut jamais
            les dévoiler à ses adversaires.
            Le premier joueur est déterminé aléatoirement.
          </p>
          <p>LA PARTIE PEUT COMMENCER !</p>
        </div>
      </div>

      <div class="row"><h2>Les rôles</h2></div>
      <div class="row mb-5">
        <div class="col ">
          <p>
            Certains Courtisans ont un rôle, représenté sur l'illustration par
            un objet et indiqué par une icone aux quatre coins de la carte.
          </p>
          <p>Il existe rôles différents et chacun offre un effet spécifique.</p>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">

          <div class="row">
            <h3>Le noble (4x par famille)</h3>
            <p>
              En fin de partie, chaque noble compte
              pour 2 cartes, tant dans le domaine
              d'un joueur qu'à la table de la reine.
            </p>
          </div>

          <div class="row">
            <h3>L'espion (2x par famille)</h3>
            <p>
              Une fois joué, les espions sont toujours face
              cachée. Personne ne peut regarder un espion qui
              été joué, pas mème le joueur qui l'a posé.

              Quand un espion est joué à la table de la reine, il est placé
              dans la colonne de la reine, au centre du plateau, au-dessus ou
              au-dessous, afin de ne pas révéler à quelle famille il appartient.
            </p>
          </div>


        </div>
        <div class="col">

          <div class="row">
            <h3>L'assassin (2x par famille)</h3>
            <p>
              Quand vous posez un assassin dans
              une zone de jeu, vous pouvez (mais
              n'êtes pas obligé) éliminer n'importe
              quelle autre carte Courtisan se trouvant
              dans la mème zone de jeu (table de la
              reine ou domaine d'un joueur). La carte
              est définitivement écartée du jeu.
              Si vous placez un assassin à la table de la reine, vous pouvez
              éliminer N'IMPORTE QUELLE CARTE se trouvant dans cette
              zone de jeu, quelle que soit sa famille ou sa position.
              Il est possible d'éliminer un espion de cette manière (sans
              en prendre connaissance).
            </p>
          </div>

          <div class="row">
            <h3>Le garde (3x par famille)</h3>
            <p>
              Les gardes ne peuvent pas être éliminés par les assassins
              et ne sont donc jamais retirés du jeu
            </p>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col">
          <h2>Déroulement de la partie</h2>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <p>
            Une partie de Courtisans se joue dans le sens des aiguilles
            d'une montre. En commençant par le premier joueur,
            chacun effectue son tour complètement, puis on passe au
            joueur suivant et ainsi de suite. La fin de la partie intervient
            lorsque la pioche est vide et que plus aucun joueur n'a de
            cartes en main. Chacun décompte alors ses points. Le joueur
            avec le plus haut total l'emporte.
          </p>
        </div>
        <div class="col"></div>
      </div>

      <div class="row mt-5">
        <div class="col">
          <h2>Déroulement du tour d'un joueur</h2>
        </div>
      </div>
        <TabsRoot
            default-value="tab1"
            orientation="vertical"
        >
      <div class="row mb-5">
          <div class="col">
            <p>
              A votre tour, vous devez jouer les 3 cartes de votre main.
              Vous en placez une, face visible, dans chacune des 3 zones
              de jeu indiquées ci-dessous.
            </p>
            <TabsList aria-label="tabs example" as="div" class="d-flex flex-column">
              <TabsTrigger value="tab1" class="btn btn-light mb-2">
                À la table de la reine
              </TabsTrigger>
              <TabsTrigger value="tab2" class="btn btn-light mb-2">
                Dans votre domaine
              </TabsTrigger>
              <TabsTrigger value="tab3" class="btn btn-light mb-2">
                Dans un domaine adverse
              </TabsTrigger>
            </TabsList>
          </div>
          <div class="col">
            <TabsContent value="tab1">
              Posez la carte dans la colonne de la famille
              correspondante, au-dessus ou
              au-dessous du plateau de jeu,
              au choix. En fin de partie, les
              familles avec une majorité de
              cartes placées au-dessus du plateau
              seront DANS LA LUMIERE. Celles
              avec une majorité de cartes placées
              au-dessous seront EN DISGRACE.
            </TabsContent>
            <TabsContent value="tab2">
              En fin de partie, chaque carte d'une famille
              DANS LA LUMIERE vous fait gagner 1 point,
              tandis que chaque carte d'une famille EN DISGRACE
              vous en fait perdre 1.
            </TabsContent>
            <TabsContent value="tab3">
              En fin de partie, chaque carte d'une famille
              DANS LA LUMIERE lui fait gagner I point,
              tandis que chaque carte d'une famille EN DISGRACE
              lui en fait perdre 1.
            </TabsContent>
          </div>
      </div>
        </TabsRoot>

      <div class="row mt-5">
        <div class="col">
          <h2>Fin du tour</h2>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <p>
            Une partie de Courtisans se joue dans le sens des aiguilles
            d'une montre. En commençant par le premier joueur,
            chacun effectue son tour complètement, puis on passe au
            joueur suivant et ainsi de suite. La fin de la partie intervient
            lorsque la pioche est vide et que plus aucun joueur n'a de
            cartes en main. Chacun décompte alors ses points. Le joueur
            avec le plus haut total l'emporte.
          </p>
        </div>
        <div class="col"></div>
      </div>

      <div class="row mt-5">
        <div class="col">
          <h2>Fin de la partie et décompte des points</h2>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <h3>Le plateau</h3>
          <p>
            La partie se termine dès que la pioche de Courtisans est vide
            et que plus aucun joueur n'a de cartes en main. Tous les espions
            (les cartes face cachée) sont révélés. Ceux présents à la table
            de la Reine sont déplacés dans la colonne de la famille
            correspondante, sans changer de niveau : les cartes situées au-
            dessus du plateau restent au-dessus, celles situées au-dessous
            restent au-dessous.
            Déterminez ensuite le statut de chaque famille à la table
            de la Reine. Les familles comptant plus de cartes au-dessus
            du plateau de jeu sont DANS LA LUMIERE, tandis que celles ayant
            plus de cartes au-dessous sont EN DISGRACE.
            N'oubliez pas
            que les nobles [icône couronne] comptent pour deux cartes.
          </p>
        </div>
        <div class="col">
          <h3>Votre domaine</h3>
          <p>
            Calculez enfin votre total de points. Chaque Courtisan
            d'une famille DANS LA LUMIERE vous rapporte un point,
            tandis que chaque Courtisan d'une famille
            EN DISGRACE
            vous fait perdre un point. N'oubliez pas que les nobles [icône
            couronne] comptent pour deux cartes.
            Chaque joueur révèle enfin ses cartes Mission. Celles dont les
            conditions sont validées rapportent 2 points supplémentaires.
            Les autres n'ont pas d'effet.
            Le joueur avec le plus haut total remporte la partie. En cas
            d'égalité, les joueurs ex-aequo se partagent la victoire.
          </p>
        </div>
      </div>

    </div>
  </div>

</template>

<style scoped>
h2 {
  color: #A97A00;
  font-weight: 600;
}
h2::before {
  position: relative;
  left: -25px;
  content: '>';
}
h2::after {
  position: relative;
  left: 25px;
  content: '<';
}
p {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
.tab-button {
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 5px;
  background-color: #9a5858;
  border-radius: 10px;
  width: 60%;
}
</style>