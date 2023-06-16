let tour = 0;
let boutonClique;   //contient le numero de cellule cliqué

let largeurGrille = 7;
let hauteurGrille = 6;

let jeuTermine = false;

let positionnementTermine = true;

let grille = document.querySelector('.grille');

let tabGrille = new Array(hauteurGrille);
for(let i = 0; i < hauteurGrille; i++)
{
    tabGrille[i] = new Array(largeurGrille);
}



document.addEventListener("DOMContentLoaded", createGrid);  //on crée la grille apres le chargement de la page



function createGrid()   //ici on cree la grille en ajoutant des div cellule dans des div rangee
{
    
    for(let i = 0; i < hauteurGrille; i++)
    {
        let rangee = document.createElement('div');
        rangee.className = 'rangee';

        for(let j = 0; j < largeurGrille; j++)
        {
            let cellule = document.createElement('button');
            cellule.className = 'cellule';
            
            cellule.id = 0;
            cellule.name = i*largeurGrille+j+1

            tabGrille[i][j] = 0;


            rangee.appendChild(cellule);

            cellule.addEventListener('click', function(){
                if(positionnementTermine)   //on ne peut replacer un jeton que lorsque son positionnement est terminé
                {
                    boutonClique = cellule.name;
                    ajoutJeton();
                }})


        }
        grille.appendChild(rangee);
    }
    actualiseTour();
    
}

function bloqueColonne()    //empeche le clique sur une colonne ci celle ci est pleine
{
    
    for(let i = 0; i < largeurGrille; i++)
    {
        if(tabGrille[0][i] !== 0)
        {
            
            for(let j = 0; j < hauteurGrille; j++)
            {
                document.getElementsByName(i+1 + largeurGrille*j)[0].disabled = true;
            }
        }
    }
}

async function ajoutJeton()   //ici on gere le positionnement des jetons 
{
    let positionJeton = Number(boutonClique)%largeurGrille; //on met la position du jeton a la case la plus en haut (sur la meme colonne que le bouton cliqué)
    if(positionJeton === 0)
    {
        positionJeton = largeurGrille;
    }

    positionnementTermine = false;

    let joueurActuel = tour%2; 
    if(joueurActuel === 0)
    {
        joueurActuel = 2;
    }
    

    
    let jetonTombe = true;
    while(jetonTombe)
    {
        /**/ 
        document.getElementsByName(String(positionJeton))[0].id = joueurActuel;
        await sleep(75);
        
        /**/


        if(positionJeton >= largeurGrille * hauteurGrille - largeurGrille + 1 && positionJeton <= hauteurGrille*largeurGrille)  //on pose un jeton si il arrive tout en bas de la grille
        {
            
            document.getElementsByName(String(positionJeton))[0].id = joueurActuel;
            
            tabGrille[Math.floor((positionJeton-1)/largeurGrille)][(positionJeton-1)%largeurGrille] = joueurActuel;
            

            jetonTombe = false;

            testGagnant();
            testPlein();

            positionnementTermine = true;
            if(!jeuTermine)
            {
                actualiseTour();
            }

        }

        else if(document.getElementsByName(String(positionJeton+largeurGrille))[0].id === '0')  //on continue de faire tomber le jeton si la case en dessous de la postion actuelle est vide
        {
            
            document.getElementsByName(String(positionJeton))[0].id = 0;
            positionJeton += largeurGrille;

        }
        
        else if(document.getElementsByName(String(positionJeton+largeurGrille))[0].id !== '0')   //si la position inferieur n'est pas vide alors on pose le jeton a cet endroit
        {
            
            document.getElementsByName(String(positionJeton))[0].id = joueurActuel;

            tabGrille[Math.floor((positionJeton-1)/largeurGrille)][(positionJeton-1)%largeurGrille] = joueurActuel;
            
            jetonTombe = false;

            testGagnant();
            


            positionnementTermine = true;

            if(!jeuTermine)
            {   
                testPlein();
                actualiseTour();
            }
        }
  
    }
    bloqueColonne();


}





function actualiseTour()    //passe au tour suivant
{
    tour++;

    divTour = document.querySelector('.tour');
    divJoueur = document.querySelector('.joueurActuel');

    let joueur = tour % 2;
    if(joueur === 1)
    {
        joueur = 'jaune';
    }
    else
    {
        joueur = 'rouge';
    }

    divTour.innerText = "tour : ".concat(tour);

    divJoueur.id = joueur;
    divJoueur.innerText = "Joueur ".concat(joueur);


}

function testPlein()    //test si la grille est pleine sans gagnant (tres rare)
{
    let rempli = 0;

    for(let i = 0; i < largeurGrille; i++)
    {
        if(tabGrille[0][i] !== 0)
        {
            rempli++;
        }
    }

    if(rempli === largeurGrille)
    {
        let resultat = document.querySelector('.resultat');

        resultat.innerText = "Egalité ! tous les coups on été joués";

        

        jeuTermine = true;
        finDuJeu();
    }

}

function testGagnant()  //test si un alignement de 4 jeton a été accompli
{
    if(testLigne() || testColonne() || testDiagDroite() || testDiagGauche())
    {
        //alert('gagné');

        let resultat = document.querySelector('.resultat');

        let joueur = tour%2;
        if(joueur === 0)
        {
            joueur = 'rouge';
        }
        else
        {
            joueur = 'jaune';
        }

        alert("Le vainqueur est le joueur ".concat(joueur, " !"));
        resultat.innerText = "Le vainqueur est le joueur ".concat(joueur);

        

        jeuTermine = true;
        finDuJeu();
    }

}

function testLigne()    //test si on a 4 jeton a la suite sur une ligne
{
    
    let aLaSuite = 0;
    let joueurActuel = tour%2;
    if(joueurActuel === 0)
    {
        joueurActuel = 2;
    }
    

    for(let y = 0; y < hauteurGrille; y++)
    {
        for(let x = 0; x < largeurGrille - 3; x++)
        {
            for(let i = 0; i < 4; i++)
            {
                if(tabGrille[y][x+i] === joueurActuel)
                {
                    aLaSuite++;
                }
                else
                {
                    break;
                }
            }
            
    
            if(aLaSuite === 4)
            {
                return true;
            }
            
            aLaSuite = 0;
        }
    }
    return false;
    
}

function testColonne(x, y)  //test si on a 4 jeton a la suite sur une colonne
{
    let aLaSuite = 0;

    let joueurActuel = tour%2;
    if(joueurActuel === 0)
    {
        joueurActuel = 2;
    }

    for(let y = 0; y < hauteurGrille - 3; y++)
    {
        for(let x = 0; x < largeurGrille; x++)
        {
            for(let i = 0; i < 4; i++)
            {
                if(tabGrille[y+i][x] === joueurActuel)
                {
                    aLaSuite++;
                }
                else
                {
                    break;
                }
            }
            
    
            if(aLaSuite === 4)
            {
                return true;
            }
            
            aLaSuite = 0;
        }
    }
    return false;
}

function testDiagDroite(x, y)   //test si on a 4 jeton a la suite sur une diagonale descendant vers la droite
{
    let aLaSuite = 0;

    let joueurActuel = tour%2;
    if(joueurActuel === 0)
    {
        joueurActuel = 2;
    }

    for(let y = 0; y < hauteurGrille - 3; y++)
    {
        for(let x = 0; x < largeurGrille - 3; x++)
        {
            for(let i = 0; i < 4; i++)
            {
                if(tabGrille[y+i][x+i] === joueurActuel)
                {
                    aLaSuite++;
                }
                else
                {
                    break;
                }
            }
            
    
            if(aLaSuite === 4)
            {
                return true;
            }
            
            aLaSuite = 0;
        }
    }
    return false;
}

function testDiagGauche()   //test si on a 4 jeton a la suite sur une diagonale descendant vers la gauche
{
    let aLaSuite = 0;

    let joueurActuel = tour%2;
    if(joueurActuel === 0)
    {
        joueurActuel = 2;
    }

    for(let y = 0; y < hauteurGrille - 3; y++)
    {
        for(let x = 3; x < largeurGrille; x++)
        {
            for(let i = 0; i < 4; i++)
            {
                if(tabGrille[y+i][x-i] === joueurActuel)
                {
                    aLaSuite++;
                }
                else
                {
                    break;
                }
            }
            
    
            if(aLaSuite === 4)
            {
                return true;
            }
            
            aLaSuite = 0;
        }
    }
    return false;
}

function finDuJeu() //met fin a la partie
{
    let divJactuel = document.querySelector('.joueurActuel');
    divJactuel.innerText = '\n';

    let cellules = document.getElementsByClassName('cellule');

    for(let i = 0; i < cellules.length; i++)
    {
        cellules[i].disabled = true;
    }
        let boutonNouvellePartie = document.createElement('button');
        boutonNouvellePartie.id = 'nouvPartie';
        boutonNouvellePartie.textContent = 'Nouvelle Partie';

        document.body.appendChild(boutonNouvellePartie);
        boutonNouvellePartie.addEventListener('click', resetJeu);

    
    
}

function supprimerGrille()  //supprime la grille
{
    let rangees = document.getElementsByClassName('rangee');
    let cellules = document.getElementsByClassName('cellule');

    while(rangees.length > 0)
    {
        rangees[0].parentNode.removeChild(rangees[0]);
    }

    


}

function resetJeu() //relance une partie
{
    let boutonReset = document.querySelector('#nouvPartie');
    boutonReset.parentNode.removeChild(boutonReset);

    let divJactuel = document.querySelector('.resultat');
        divJactuel.innerText = '';

    tour = 0;
    jeuTermine = false;

    supprimerGrille();
    createGrid();
}

function sleep(ms)  //snippet de la fonction sleep
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

