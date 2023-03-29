import styles from "../../styles/View.module.scss";
import Loading from "~/Loading";
import Header from "~/main/Header";
import FileView from "~/main/file/View";
import PeopleView from "~/main/people/View";

import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { auth, db } from "lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import Cover from "~/main/cover/Cover";
import Head from "next/head";
import AddButton from "~/main/addButton/AddButton";

interface UserDataType {
  setting: DocumentData | undefined;
  info: DocumentData | undefined;
}

interface DataType {
  user?: User;
  userData?: UserDataType;
  peopleData?: DocumentData;
}

const imageCode =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZ8AAAGfCAYAAACA4t+UAABWY0lEQVR4nOy9C5hcV3UmKmMIJJmJ54MAmUBgckkm3+WGe5OQ3CHwzR3fmQs3ZrBUVXYHY2NjG/ADbGwchxgHg/BnMI9gG/yUpa7qbr1lSdbDkiVLltSSrJcly3pbkvWWrGd3q7v61LvqzPp3SaLV6u46dWrvs/Y5tf7v+788QF1nr733Wufsvda/RgkEUYa7/Mp3905oef/Zjqv/dDj2p2J/lUnF7kmnEi+mU/Gz/am4q5v0d/vof87rT8bvc9pinx7pefra4x/Ac3PbTiAQCAQ1kGlv+Ui6LXZNXyp+60D2t8Xvp+CyyERAMcilxH8ZPBaMr2t84qPcthYIBIKmhNMe/2J/KtFxMZXD7rUgcJgkxkfjvHjsTmrMF7nnRCAQCCKFvtbRf0EOdyvx6HmaOhoLK8/Z44J9YK/8pDGf5J47gUAgsBqZ9i99hO45/jOovmra4qe5HXrEeKavNR47b2PYm3vOBQKBIHDs/c1V76W39TvO89yXDbeDbh62xbcNtP87467+Pe41IRAIBEbQO+H/fz85vqkgssrYHbBwIOddmJuO+Ie414pAIBA0hN5U4jP9ydgb5NROylFaaHhGzRd9jfa1JT7HvYYEAoFgRPRPGf3h9IT4X9IxzpXkuA5a4ESF+ngwnbr2SsyvMzHxH7nXmkAgaHLAEVGq7810jHZ3f1tsiQVOUmiY9HLRiflG3dEZSVwQCARBgpzQvzht8dn0PzuJDrdDFDIwGc/R/1yJdZBOxb7PvSYFAkFE4S686r3kbJYTe4gFducntIlYDz1OKr7GTd38Pu61KhAIQgx37JXvdiZc89c4ViPHcswCBycMD0/Q8dxtWD/uuE+/h3stCwSCECDTFv8skcQv4w9Z4MSEIScdyT0MMdW+CZI5JxAIhkB/asynKODMJ4exm1jhdlrCyHEP1tfZVPyvude6QCCwAHRO/yCpPvefu0DmdlDCqJPWmZNK9DvJ2A+4175AIAgQ7qSr/gD9a/pSY/4ruyMSNj3PToj9D6f9mr/uScX+A/feEAgEhlDtbRN/noiMNXbHIxSCUOVOJ+NJ+t//hXuPCAQCjci0JX5OgWcxbW65yxHazArWKdYr954RCAQNANpctKFRgyFBRxgmYr0WRFtOIAgJ3LFj35XtaPlTnKPTG2TRAicSOJ1JN7iZefe72QUPXsqlP3UL2+e6lfRJlwsVp4ueYZ6bffXRIZ8Rz+5MvpHdjhaxjE6tubbYJ9wZLZdz7zGBQDAIfU/FP4CaClSZW+AwzLPjH5UDz78x9SIW9yx1K7k+tuDSKCq5tFt8e8Ul48q99ozrTP0av935uIHuhR4RPTmBwBLQ2+DvUvba47Q511vgIIwxu+iHbumdLW7p+LYqT+xwK5ke7lgRGCqFjFs+vee34yfmN01y+yd+hX1uAuZGSlB4sntcyxXce08gaEq47qjLoEZggTPQyMQFZpf9jNvfhw6lk7vo6+jmAXbknk+zxPEy9gH3XhQImgLZjqs/RscP/502X5Z78zdKZzLdz7z0gPqqwRFaufsgt/+OFEpH33CzSx6p2nfB911nSiTvkrLYD9gX3HtTIIgslE5WyPvmONNudfOvt7uFN2e4xb2vqjsOgXng2A53SbA77pAyCx9kXwtaSfvCof3BvUcFgkiBzrhb0MSLfYM3wOK+TnUsVO7a77rlIrcvbm5UKirjD/MBZhePZV8fuqj2STJ+E/eeFQhCDbfjC7+PtznuDV03268ltri5Fb+Cp+N2tYI64Lxwu5o7NYfc66gRJmO/6CIpKe49LBCECtU+OvF/YN/AdQac7CsPK3LW0Qj0AJl1uc7H1Hw6M27jX1/++Q/YT9x7WiCwGjtmtPwOCX5eTRsGbQ24N60n4jK7sGWmW9gxn1yWfOVEEUhxL2yd7eZWPVn9KrJg3dXJ3U57Iub+5qr3cu9xgcBKOG2J1ylF9rgFm7Umc52Pq7fjSv8ZdYcgiD4q+X63fOZtt3T4dTcz97vsa7BOniRu5N7jAoE1cMfd9h7aFFCaLluwQYcnFTNCuqawayG3DxRYBBzLqULX8HwRkW5cogP7jnvvCwRswBEbfe08Y8GGHJpt17iZOfeSJtpPVKquQDAciofWqXUCbTr2deuBlBX3HGnGXc3tAwSCQLGXzp5VzY4Fm3A45jdPdws7X5LCT0FdKPceU+KtCETca9gLkU3qjrv697h9gkBgHNSr5Bpa9FuJaHXAvvkuCTrrxp+rxSlx+zFBiFHJnlXrKL9pMvuaHpFQf0/Gt2FfcvsGgcAISAD0CqrC/h/sm20wSR3amfxVpZosEJgC2kioVhFt9mrOOanRX8I+5fYVAoE2OKnE39Hi7uLeXIOZW/ZzklxZLl85gsCQW/10tXZoyk3s638YdmXaY/+3O0oESwUhhtse/wAt5ieIVtXt5Ne3StaagA2VguMWD6yhe8VptB6t/BLCfn0C+5fbhwgEvkALeA/RmhbWmfnfc8s9hyk1KcftfwQCpfGH9QiBWe69MQSxb/dw+xCBwDOOPEbN3VpjX6CFa8cx26TrXWfmnVIIKrAeaKvhTLuFf88MIKVkn4WwL/Y1t28RCIaF23EjCYHGn+XeMIpUowMVguKh9dw+RSDwDnpJgiBt5sXv8O+hAcS+xv7m9jECwSVIT0j8P5S2OYV7k4C40ynuWcrtRgQC3yif3usW3lrEvpcGpWVPcVpjV3H7GoHgAjLt8UdpcUI7inVzZObeR0V+78idjiAyUEWr1ACPe28N4Bnsd26fI2hyQCU3k4rdw7oZcKcz/RskPVzg9hMCgTGUjmysiplaUieEfS/3QAIWkCbb6P5UDF88fBtgwQNucf8q2pqSTCBoDuTWPEdtPH7EHnzO8Qn4AW5fJGgi9CXjtyALhm3RU+O24luLq0dsAkGTAW08kJ7tzLyDO/iAPfAH3D5J0AToS8Vi6WQ8zbXYIYNT6T8lqdOCpkcl060yOrkDEPwB/AK3bxJEFH1VtYLPsyxwOudGb/1KMcu93wUC61B6Z2v1K4h0CplrghJusuWD3L5KECH0tSU+R2mWizkWdGbOPW5+7fOSUCAQ1ACy4rg146geaDX8BbfPEkQAfa3xv6dFBZmcwBcy6nXQtlggEHhD6egmN78hxRqA4C/gN7h9lyDESNMnNC2kbo4FXO45Qjspz72XBYLwgU4JivtXc0v1dMN/cPswQcjguqMuOzv+6j8NfMHSmTWab0FwUSAQNI7MrG+rflVcQSjXFvvEjBktl3P7NEEI4HZ84fedZDxGC+dEoIt05RPqzFogEGhEpaS+gnB3yhSATmZS8eu6Jl31B9y+TWAx0MudMlaeox4jx4NcoPn1ScpkE0kcgcAUymf2KdVspgB0itKx20+IMKlgONAiOUMsB7UonWm3UproFslkEwiCAL3gQSuOKQDBr5zh9nECy+C0jv5jWhjBZbS1XetmZt/NvRWbD5TAgQLdcvch4sHaJGXl0rEtqi3FYEJrDP+5p78Dnj3qVnJpKQ62AHjhUzpxPHVBe+BvuH2ewALgQpAWRGdQi0/V7WyaJAWjplAuuaWTu9zCzpcu5o75bn5jR9XpMLRuxqU3+tQUts259NmopbmSSpLAFCgKW2ZyBB+wE36H2/cJGHHq6ZZ/RwthfWAOaPrX3XLXfu49Fx3Qlwx6vmSX/Uyd5ysu/YnKcGJyKv5Ijf/Q4jy79Ke/HQeNqbh3mRzJGkbx7RWuM/VrHPO+Hv6H2wcKmEALoDeoxZZ56QG3Ushw77VQo5Lvd3PLf0lfETdUOekGEllt4Q8epkjHQhjj+fFmF49VemYCnaiofZlb9STHHPdy+0BBwMhMSnyUJn53EAsMb1WouhZ4RyV9Uik7gDii7O/4Mn8gsJDZhf+qdM2qttrnVrK93FMXauSW/ZyjX9Bu+CNunygIAL0TRv8ZTXggdzzQmSoeeI17T4UCuJRX9yHEzLx/YnfsoSM5TXwVKhtun0svPG9wT2kokX+9XR2BBjx/nfBL3L5RYBDvUB0PNX96PYgFld840S0d3869l6xG6cTO6v3GkkcoEeNefgceIaK7LewKoveNwCMo6QOZidnFPw52vsgvwT9x+0iBITht8UwQC6m4Zwkt4jL3NrIW1TRXOkqL8n2NTaTmg8reRKUZKKgNkrgKulkd/BO3jxRoRs+ExMdpcncZX0B0QVx48wXubWMVKmmqqzm1W9XFsDth4QVmFj6ojuYwN5L2PzzUEdzErwQ5N7vgr7h9pkADchPVHc9K04sGCro4bxdUgQtw1FHAyXHU1Qi9M7d2nJor1b5Dao0uAmSvCjsXBK0NtxJ+i9t3ChqAm7r5fTSRm4NobY3CRgEV7lHBJFKCoeDA7VSF9TEz+y41d7nVT3MvI8tA90CkihFwi4bN8F/cPlTgE9R9tGh6kUCNWt4WqVhv/yolG8SQqio0QZrL3PJfKD00wTnQPW6wcxAvcvtQQZ1IPxv/EE3eRtOLQ23OZgVtxNKJHW6u8zEJOBEnLt4x19DFw1dAMwNFvgEraOzItH/pI9w+VeAB+FSlrJGHaNIck4siv2489z7gAWUBQdJGFX9a4BiFwTG76IdufvO0pq9dg0RWZu59Qdm9QHzidOvof8/tWwU1kG4d/d9osow2gstvaGu+Ftd0tFjct1JV1Qec/SO0jFDtyL78UFPfc6IWKDPv/qBsfqa/NfYFbt8qGAFoBmd6Iag7nmYCBR1JkxaOxOqdZ3Mex0EANqhszhO//II0o7MRTus1f2t28km+hCTxmwU43y/u6xSpG6EnQtpHNUZssuJqlYq9dVZgytjwc9y+VjAANCmfJx41NulUIa6O2poAEKdE7xuc73M7NGH4CG003Ak2FegeVGV7Tro+CBvDz32e2+cKCE4q8XeUYHDE2GRTr5X8pslNcceDind1kSoq0sJGSE44s+ABpZ7QNIAmHHW2DcK+8Hfwe9y+t6nhzmi5PJ2MJ81NNB21rfoN97I2CxyTUMMydocljCSdKTeqL4NmuRMq9x6raumZt+2C5WOvfDe3D25apNti15ic4Fzn49xr2SjQC0bV6VjgpITRJRS2cRRXyfVxL/lAgAQdZ9qt5m07Ycz13D64KeG0xe40ObH5DSnuNWwMEJLE2bykTAuDZG7Fv6l11wwoHloXyP6CH+T2xU0FJxW/g47b0qYmNL+xI7J3PMXdr1RbGljgjITNyewrDyvFhEgDJQrHthi3Jfwg/CG3T24KUKT/NBn9sJnJpDuelb/mXrZGoPrUUzost+MRCs8Tx1NYl1HGBc1Dg3ZMp+Jn+9oSn+P2zZGGO2rUZRTpHzE1iVG846n0n6Ystk00PtFfE1pI0gWsKiVEMyGhknfc3JrnVK8vo3ZMxkhoctRl3D46siAjP2Fq8nJrnuVep9pR6TtRbQdseuELhQ3Qmf510kqc4Jb7jnNvGSPAPsy8/IMgbPkEt4+OJMiwrebSQW9S/TqihOLBtaRGfCe7YxEKvRLrtRJRhQScQDiTbwzCjq3cvjpSONeNdKuRyWpvUZfwkQHJfWSDecsSCo0Q6zeqfYScyV81bb9dhfZr/prbZ0cC6WTLB6mp0nQjE0WBJ0qtr4uH1iv9OW7nIRQ2SqzjKKpmQzPReDsG8pfwm9y+O/RIpxIvmpqkwq6XudeiNuTXt6pgyu00hEJddF64Xd0FRQ3l7oPGyx3gN7l9d6jRn2r5I2MLe9INkWl/nXvtGRqTZLMJo0gqf1j9FPcW045K/xnlg0zaLt3+pb/k9uGhRO+ElveTAcsmJsUh4cMoJBigoZXU7gibgZDoKR3fzr3ltKJ0+HXTLejL8KPcvjxUyCTH/AkZbqORRTztFpr0DdzrrmGglbF87QibjcX9q7m3nlYE8PK4OZdM/G/cPj00yKRid5NseMbEZGSX/uScym54Udi5ICjlXKHQLlKLk8LW2UqfMAqA2Co07wzarNCfjN/P7dNDgXPyOV1GJoKE/iqZbu711hCKe5bQOK7jdwJCIRep31Rm1rcjcXQOVPL91LzxRyZt1gW/yu3brQcZqmBqEkINEjrFkQP7xo8s6QiTlCBQh+HM+KZ3UnU+ipRVpqHZ83vhEETxZlTgTL3ZqK0gT8bt360FfR7eZMrw2aU/5V5bvoHUTLR44N7ooSYFBmfmHeqMHQ0CLyFlDBa2zFTdXOvJgkTbcSg05zdPVxpeQ/5tEqvNvPSAyByZINkUfamiAJR+mLVX4mZuH28lqDDqfjKQkey27LKfkZM4y722fKF0fJubmf89eauuk7BZce+y3/Lt5VUZf5bKeWqxTB0uoXA88Jlwd+HMuI3dVmGnyoSjzLEolE7kN08zaasy/Cy3r7cKUGPtb4stMWX0sKoYlHuO0Kf412gMEnhqEWfmOIK5wDB0zSyX6A6y56Lnxhc6ty3DSByXFrbP5Z7RxkHJUPlNk03aaqk7o+Vybp9vBdyFV70XcuDGnNKrj3IvJ1+opE+yb2j7SEdnlCoPAcrMnHvpa2YF9zSZRamgsjMxXkXzumChJ+7hENDDDCRFZRY+aM5ObfFfHkhd+T5u38+O3uSY/0IGMZNkANFQOm4JG0rH3pSMtotqs25VdzK4UymfeZt7etiA2i60/sitftrNLvxX9nmxldBOC3smnLr/MVdOUe5NJT7D7fvZQVF4salFiAvksAEX3nh7497A7KSL5NyqJ93ivpV0obyFe1qsA3rfwDYg7jzY58syZub9E50enOKepoZgNLuV/C6372cFiklNLsCwFZPCoUBMkXvjctKZciN93eyr3oVEVFZfN5Bxh6MaJDHI0dyAtUT3pWFHft14c/ZJxZ7ijgEsgISOk4rnTBm2fHoP97qpD+jDs+QR9g0bOOloITPrW9TD5SHuGYgOqCYMWVOZ2XefS1ixYJ6ZCPFOiHiGFSizMFX/A/8LP8wdCwKFO3bsu/pTsUWmFhxqKnBhHxpUSpThMol9owZKqlJHDQzGjQpvgRlAxzC3dly1nXqTSjJV74AOck+Fb+AO2NhRPB2/ueNuew93TAgMfa3xGA38hKnFhvqJMAGp4M3Ui6ewY35V3JXe0AXBAG//xUPrzgnS8q+BoIkAFGY1BNQqGrLNyXRb7BrumBAIchNb/oyUDLaZWmTZRT8MlVMr7lnaNIFHFfui/iaiffrDAsyBSlRosiM53IeFFZVCxqRCxuH8pJZPcscG46BajevNLTBqPEWpqGFBidpec29I89XnX1c1OQI7UaEXAcxPs2TMIQCFOQvOXABKXM8dG4zD6OKiiUHVeBhQ3P0K+0Y0faeD1t5R7MMfRZROvUXzlWyKNP8w3wGpdvmG7OKOHfUu7vhgDHS5Nd3oonr5B9xrwxOQRqyUkC3YiCaIC+7S0U3cZhb4AIIQjuSwl7jXkVFfQV97YbwDquTSJFT7hBGbUPbbDO4YYQTp8fH/3VSDuPMMy10PsrwiqddGXzuozA5bfZVgMEigk/ZSpe9EpOuGwloHVHhrkRkFlGQ8l02N+a/csUIr0EecBrfc5EJCTYP1IK2uKKZUw/Yq0UMQSeBrKDPnnkhKPqEVRhgTYPJrn6fn1/8Cm07FO9PJqz7IHTO0wUnGv0kDc0wuImwQ26Ey2yzYcNrYdq2qHwnj8YWgPuCoGCnyphueBU7qblw8sIbbvL5gKPmgkE7G7uKOGVqgUqtT8V0mFxCUjstdB7jXwohAVhEEMtk3m7ZNe53SoZPA01xAAklh10L+9adZuLZ0ZCO3aeuGEiA2Y5Nd8NvcsaNhoHe46cVTeHOG9Y2k0EWTe5PpIi48cYQoaFJgr51r98C9FrWR1B/Q8C9sKO5ZYsQe8NvcsaNhGF809OlZ2PkS9xoYEbnOx/k3V8NEG+o7VSaUQHAeWNvIHONfn3oYtpYdOPExlR7PHTsaAmVPoDW20cWicvZJDdpWlLv20zN+l31TNcr8G1OU2rRAMBgVp6vagdVcBX5gxJ0WVMLDBMiJ9bddo98e5L+5Y4hv0AB6TS+W7OKx3HM/LFRHwrC/FU66XqV2CgQjAWu9dHybSrdnX7ONkKSu0MY6TMC9K/oXGbAHReFRl3HHkbqRTiVeNL9YIKfzHPfcDwt8kbFvpgaYfeVh6+/SBJaB1kv4a9gSKjM1TCj3HKGvHxOp14kXuWNJXciMT3yU8sVXG18kdEloLdQm5N5E/gg9Npu/KAWWg4qM8bWMxoDca7kRopNomICeWLptAD8eqp4/dFZ4XyALxOLgo9okWLCB6mV20Y9EGkegBcW3V6haMO413ZB/CZlahxE7kD/njimegPxwipb7glgc+Y0Tued6SChZEqo9Yt88dTIz/5+lbkegFaUTO0MtVoo2IGECMn912wD+PBR1P04y8TdBLQxbYUr4zxjprNiZcRu32QRRBRVYQ8YmrHdBqq4NenchQPnUbtU6XLcNnPEhqPsJclHYiNKJHaEqKEXtDp5ZIDCN/MYOWnMhDECUxlzcu4zbfJ5hqjMyd2wZEZQZ8VBTdyWkNzzoX7FvlnoCj/TbEQQIVZNiwdqvl9klj7iVfJrbfJ6AzLfMi9/RbgP4d+4YMyzoAbuDWgzFva9yz/ElQLFdaM636ait3HOY22SCJkTxrcX8698HUUsTFhgSMe7mjjFD4lyjuEpQCwEXmbYBzpx7g3giOr4KBIwobJ1lpirfMMvdh7hN5xkmFCeo4dxM7lhzEVS/nrbYkiAXgY3Bh3tjeGFm1rdCtYEE0QWUBMIWgCC/E5YW3KrwVL8NlqU74h/ijjkXkEkmvkwP1RPkIrAt+OB5uDdG7TueO+SOR2AVCtvnhS4AZV99NCT3PxWVKq53/LF+qvu5iTvmKLjLr3w3fYo9GKgTpWSD8um93DN7ETLzv8e+KWoxjJLxguhD3U+EKQCR3mHx0Dpus3kC+hTpt0HsUTd18/u4Yw8lGYz5VNCTj7x7q948yiVVJ8O+KYYjNX4TjTaBzQjjHVAlfYrbbDVRyfeTv/y1gfGP+RR37KHgE7sn6ElXzeMsQmHnAmv722dmfTs0Z9SC5oa6A7Jgz3hl/o2p3CbzBNV5ltqF6x1/7B7u2BNoUel52hZ8cqueZN8IQxGVzsXdr3CbJ5RAUgZ6GOXXT2iYaDfuFnPcQwoFwlQnZ6MvGgqVTI/qe6Z77KyBh+56bm36CafjrNyq37BvgqGIe6hKIcNtIatRyaXdzIIHVN+lgXReuF0JS+qYB+j8oehv4N9H8zV0oRRcClOtoU0QSTw4drcd+XUTTKRdP8IWfKi25zTHhNsUfIpvL2ffAEMujCk3cZvGGlSKWdWdEkRnWRuPSDPz7ledYtVz5vqa/o5O3QFpCv6mqbTfQqB+rV3aiPw/S+Dpa43/Pamd9nFMtgSfWkxQmkuB2zSsKPe+4xYPvKaYXfxjC+akDlJwhJYYnr189ii3KZlAJwqdj/PPhReSjloYev/kOh/TOm74/77kmM8GHnzok2sG12RL8BmZ+fWtTfnmXDq+XXW2BTMLH2SfBx3MvPSAGg+SWipNdm9UVQwJhxAp+mBV8g63yUYGHQ/qHjfiQKCBJz9pzCfphzdyTbQ1wYccPC70uRf+QOZWP9V09zzZBd93M7PvCmUPJc+kbCWoU2CczQQkfrDb3iPxtW03yF/p13zbhVOwwIIPqZt+i3OSbQk+aLzGveAvIn3+46w80qCAX8medUun3lLFfuw2ZyKSJNQdEWUyRR1o+aE/VdgMcb9oM0rHt5Hm25e1jhnxIJDA0z2u5QrK8U5xTrAEn+GPaKIKbGqcqyMTypmsv1lWaEmOpLivM/KySYUtM430qNHN3GvPcJtqROBUJLf6ac3jjqUQF4wHn3RSHbmxTrAEn6FZOryB2yRGkH+93c2t+LfQZD9xEL2Z4FTwVRhFQBoqM/tudjvXlv6i2rq3V3Cba0TAf/a36d1LiAvGg8/Z8f/z09wTLMFnaEYNxQNrlFPVvVGiTMg8ZRc8yD11RlDpP8NuXy/MrXmW21QjApI76E2kN/FgzBeNBx/uiQUl+FzKqKRWVwqOVXYNLalZYGH7XFVEGynQOme3rQcW96/ittSIgDK37jEbDTzOxMR/5J5UUILPxcy+/FAoitxqodx3nI7XfhWKs/2wMLt4rPqCRIv3SIDShbOvPMxu11pEerxbynNba3gYSLvOpa75c2PBJ52KzeKeVFCCz8UsHX6d2xQNAxJFSJnmtmUkSZliKNiMSlIC2tVnlzzCb9carGS6uU01IpypX9M85tgiY8GHfuAE94SC+c3TrCiitCb4QLgyxMAdBbcNm4GQXIKMTxRQld+x+wvZmf51bjONiEr6pO4xnzASeOhC6ep0Mp7mntDqpH7DClFGG4JPfkMqnEcqlZJbPLi2mlBgwZpqJjozvqlke8JejJxb9nN2W9Zipe8Et5mGB92foTGnxvE6lPV2u/bgQ394KvdEDqQNbbStCD4bO7jN4AuFbXPYbdfsrKphWC4JUwO2N6BDeri1oNMjAy0spmoNPOln4x8iBdPF3BM5kBJ8qgxj8MHXGrfdhFVml/6k+vUcUtiorTiQqqcWSdrYChzZax5zZ7aj5WPagg+J+91Mf7TAPZEDKcGH3qrmflfl7IcGdDyYX5+0/m216Ujzkd/Qxr06fIL0yqiok92GIzC3dhy3kYYHZcnm143XOd5CH/V50xJ4XHfUZdxabkPRhjx69uBDzeLCAhzvhK1NcrMxt/yXSi8ubICaOZIpuO03EtEew1bg9ETnWCle3O2OHfuuhoNP37ir/9Bpi8/nnrxLSKKS3JDg4w1oBYC6B/Y1I/TE4r6V3EumbuQ3TbL6ixrSR7bW/ZQOrae065t1jndpuiP+IQ1N40b/BffEDUduoONkZv4/s40/FMGHjtogtsi9VoTe6dCLHVqFhAnlniOq5QS37UYiutTaCvgSnWNF3JDgYxLM/XzCEHxwl2DzG6lwGHb8o1s8tI57+dQFHO2y220EZubcw22iYaG7+aKW4OOkEv3ckzYcnRdu554z1mwbq4MP1fFIOnX4qQqYQ1RHlplzL7vNRqLNMli6x9pw8OGerBFJEvvckOAzNApvvsC/PoRaWHhrkdICCwNs//op7HyJ20TDQvdYG/vqSSb+hnuyRiQd56AzHycgUQFhT47x2xp8VJdR7rUh1EbcARV2LgjHFxAFSZuzKvFlZiuQkad5vP/gO/ikU/F93JNVi1C45UZu1ZMSfAYA+mHc60KomXTKEJY7IGRvsdtrOFKrC1trqtAtWPN4D/oOPvSPj7FPVg1CCZm7Zwk6bXJ02bQt+KiU6pW/Zl8TQnMsvbOVe5l5gipmtsBeQ1E1m7PxGJNSwdGMUONYj/kMPLG/on/cxT1RNTnxuuqZNCNw9OZMuzXwsdsWfOCY9Mu0C21jce8y7qVWE2gzorl2RRszL37H0mJe7WoR3X3JMZ+tO/g4qdhT9I/L3BPlhYUtM7lnTWXeNXPwwSe77ta8Qjup6oDeWsy95GoiM/c+dlsNRyi62wgEbY3jRPx4vv4vn7b4JO4J8kzq8V8+tZv9kzXocVsVfPJp/nUgDIzoVWODvuKIoLRmbjsNSzqmt1GXsXx6j94XaYojdQWe7nEtV9A/nMc+QXUQKc/cCLrGwJl2C72pbOAetgKKErnXgBkmlCw+7hYv5oMqyxFtqnGBDGVotADPLvrhEP/d71fXBsO9oEmioZvtGXC6K/d1kvuuejiownB941zQO6Hl/Z6DD2W5Jegf9XBPTj10ptzIPWduuftg4OO2oaWCgSwZVmYX/1il6yq+MUVJtzR+L3hKHQ+f/7u5Ff/GPk4t64/sYzNs/iKHHp2N0Bx8HIon13kOPn3JxDe4J8YPi/s6eWeNsr3y6yY0XfDJrfoN+9w3SlwCl97ZogjBWNOALuD533Mm38A+/sYC0FTj9vINtAywOPPNRpRO7FDdonWNEfEk8sGnv+PL3PNGmUCvBjtmuvzlLrS1+WK3FnHBiiyfKrlQ/f1qk70Eu03qJeq6bAYu97ltNBxxamAjdNbqeQ4+fe3xD1Ca9SLuSfFFUjwo7HqZe94Cr3VR+luMCFfwoTscElG0ucFXuWu/uk/S+fZpmrjvsvUOo3Ryl+76FW3E3rERmgvF1/ePH/3hmsHnbFvsE9wT0qh8Rbn7EOvEqf4Y1D43qDHnOh9nK1rDfYgz8w72efe0Nl56QGnOuaUCi63qBV4qCm/OYLebJ0Lq6shGbpMNC83dOiMffArb52odJ+JK5IMPMooKO+Zzz51KWQxy3FwOFZpf/RO/wj/vNQgnXuk7wWKjRoFOnTbfW5wn7s1sbZhW7jtu50sS7R2lm2cbyJ/oHKen4JNLXfPn7BPSKOktrHx6L/f0qTuooMacffVRljGqN/P2Fv45H2Et2FhP4Qf59a3Wp2ujuaKtsLXdAl4sbITOMXaPH/1/1gw+/cn4Nu7J0EEb3iYqTpd6GwxqzLgrCBrFPUsCPWKsh86Mb6rz/qgh+/IPaHz2JiawF3wPg6AzUb0Sx+aVvMNtnkuA+jaN4zwT7v499W4C5rsfAAEhM/e7gYwXBY5BQwXY2Xexz/VgqgLcY28Gbo9AQCn9ha2zWVu4j0SblDcGg9s2Q67VyV9VKfe2QXdrlKYKPnD6NkB19AxAAUD1XWEQWbUx2w0Fv1EH7rCszOLCPcauhdzmGRLq6JLbPkMQSUq2QXdjvhEDjzuj5Xe4J0E3s0seYa7hqMKZeWcg482teU61NggSVgUfCvIo4GwmVO8W7TqGg5O3sW1AJdvLbpuhiPpAt8LvpwaiUshoXVf7xv1/VwwbfJxUfAb3JOgmzi2ReWYDqmf15sesVL4DXMg2pbGiG2OzAQkV2WU/o+ObG9ntb/tc4G5F812GNuJLwypQ5iK0C3WNj2R2Okc6cjvMPQEmCKdf6T/DPZWqCC+3/BeBjDnoDBruOT7fWLDceyzQcdsCBCAcueL+gHseLszHwn9V8jZWgV7KinuWsttmKFoXfAiau8IebrrgA6LXjA3AZz+EK4MYc271U4GNi6OZ3mDm1z4f2HitBDl6SC1xz8NA4tLaNuCLjNsuQ7Hc+w63aS5BIMHHHTv2XVEOPiAcvy3IzPpWIGNGi2+3Yv7snVs9WBU4ChSK+1dZVQ9kG9B5GJmh3HYJg600B5+jlFdw+SXBJ9ue+H/pP+zmNr5RUsttm2oQsot+FMi4UQhqGhBIxLEX19za8mVrBSjhJPfaM2QXO5IQuIVvhwK0/bjtMhRtg2oupy9Zqjc9Ycy1lwQfugx6jv7DULTNboSQ2LBlM1TvgH4ZyLiRFGAaWKhBfdENJnrPC36L8tmjSsuOe7+BeA7bUE2SsSM4D6R1IJmd3JpnNY4xlhqqbXY7t+GDIu4nsDltAAJQYHdA1HfHKOjOofrGzbBpLe+oyQEk2aDdNfd+w4lDYedL3Oa4CJVMd2DlD/UQNYG2QauuIMWZpg4+ILKCkMduC4JSCVCSM4a//JDlFPR8CoaHDcKv6FVkW91PkNJXXmljbyQJPgYIJ4n2xrYgqC8gEBk/kMYxhcycewKdS8HwsCG7y5l6s3WZb9lXHma3y2BaGXw2TlQCvVrGODj49Ke++EehbSDXoOIxeunbkuKo7oAC7O2PYGeqB0vpxE7XmXJTYGMRDA984Qfd4HAo2qa1Vz6zj90mg2lj8Cm9s1VnKcXyngmJjw9MNriO/p9ZbsOzkNoBqC8gC4pQARQLqgs+XW8aNehM/Zo68tM/kLJKAgiq6h6Fg4LhgS98dEfl3GvQobPt6I3d/wwliHt4A7dZLgbNmS5xZFLRyVGix/UXgk9fMn4Lt9HZSaKcuIS0CTiqCGz8bQk3/8bUc9Lu+qR5ilQnEMTZutT51EZ+PbUUCOilZjhaF3ws7EWV39DGbZZLoFO/EfFGgs8gKmnzEzu45/kC8LaquZd6TUKI1YTIoWlZIXy9BS2oGkYg4YRzjxX3LuM2wUVQ9xkW+J6BlODTpHReuN2aOiAAPYmUFlWAXVHB3KonqY/7PH1BiEQK9dYLDCJTO4mwQakfMO8xm1DJ9LDbYzAl+DQxcVFuSxLCeeArKHBbUMBDMNbVkhwqCJA2MdVLP7fiV1aKM9oG7v1lE6wMPtAotEyQVacc0YXg47qjLqNLoDu4DW4jK/2Uhk1v7NaAFmS1MV2wX0GK9JvlnsPVXjkavoYQ1JDsoPs5C7teloLTGij3HWfdV1CZtwXQe7RJCRzMzPo2ZeK9zW2ai4AkCF3jSydjd0FLdJQ7ruWKdCo2i9vgVpIcbn5jhzVqCOdR2DFfHYtx2AR6dDje0tGiHDp7GAc6sOp8xsLOBY0bOcKoZM+y6vBlFzzIbYLfgl5UcLzM7msGsXT4dW7LXAJdY6OPnTXulKv/cFRXcsyfUKr1WW5j20xoU9mWCQfkN09XWWpc9QiQ0imd3NXwOKCcC/FTnc+X3zSpcQNHGMU9S/j20/x/PpdVaQdsuAcbzCgHn/5kPJftaPnYqGwq9p+4DR0GIv/eOtAxHOqT2Oo3KPA5U25UGlk6xoLjoOzSn+p5NmopkH9jSuPPFVGg8DT76qM864bSmwtbZ3Ob4AIk+HiDzvEh7kjwqddo5BxtemsbCJwVm7hH8a6YMLbaSZSUcLWMhQJ+o8+ELyrbjk1tQW7lE2xrxaYXg+L+1fRMdilcS/ARDkls2uLBtdxrYUiUjm46p5DAt5lQrKqjngNaYGosGoQxiwfWNG7ciKG4byWb6KhNwQcyO5k597L7lYtbhCynJ9Nba9codI5Pgk8DhGyMzW2b8TaX3zyNz0Yd/6hSn3XoeSHTprBrISUm3NBQATFaSpS7DzZu3AiBq+UCnD2yJ22B0Ro0P/ZBRqCGEwSd0Dk+CT6NkqRKcN9hSpyzYeBOiDKbcp2Ps9kImWyQCWoYlJWEtFjY2n9qLN1RWdZKgxumaq68EIKVtsC24IOTC9sUO3TKfUnw0Ui84av7DouBYlFooHHVNUDCXr3taiiggwyS6oHkM00b9UAoMBTwFZ1K8BmZKMq2Cbk1z+kNPunkmE9yGzkqhDICdNEq/ae518mIwHky2ghnl/2MxU4479eiQk1vhqg5gh6drw1AVdvlniONP0fIwbVfJPiMTNuCD+5gdY2tN5X4zKje1JjruY0cKVJhambhg1UlAMuBYywkToAcdkLwKx3b0vg4qCkevmT83AmhXgnP0czg6DwLIjtSt4CtXxS2zFT3lOz+YwBtCz6VfFrb2JxU4iFqJBdv5TZyFOlMvoEc2z9xrxfPwMICtbbM9ULq74/kDS13Qvl+37Ur+AqyTe4/KJS7DjDtk4Q1wQeX+5lZ32L3GwMZ7eATX43gc4zbyFEn3qrKXfvDpTlG9zJQslVqthQgjNuJLlgvdJWtNB4E8NzO9G/4uAtaaI9DDAiog+LaGzbZWt0hWuAvzjPKwYd4AsGH3cjNQgShwva5oSt6hJYcvoiCqIhH9iAKQ3VsPLTyzsy+u/55oup7pKo3CyT4VCHBZ2RoDj6uBB8G4jguu/Qn3GupbiBtG5XXoGkbKQFTCnqNAl+cfp5XJY+oQr/oA1+bLErpRAk+wxNtVGyCBJ8oEdXlxOKhddzrqm6o3jzE/DpqzWzKPqTPBvtAv67h56X2GHV/uUGDTDWos8dBGgG1DYF6O8cekOAzPJFdZhMk+ESYSH8un95TfeOxaFN6AQo3M/O/p2jiLRr3N1AnaPQoAl0i/VwsRz0lu/jWYpY1r6tRoQ7YFnygUGITJPg0ATMLHqjeD9Hlt22f3l6g7oioN77uOyKIpubWjms4AKEXEaR26m+vvp3+dbheCryCK/ig6NkW2BZ8VCq6RZDg00ykugP0Psku/rFy5mEDFARKR98gHa97tNoFnTBzq59q8EvNoa+gVF1faZCiQdCKYgDiCj7IcrQFmbnf5d/zA0nqHTZBgk+zEirVdAehWuxadFThCaifodTt4tsrNNqEdNroSwgq3r6B1Hd6rvpSyavzEDWwBR+iLUBzRPZ9bqltAAk+wgvMb5qs0okruTT3uqwLuc7HVHdYXb2HoHoNWfxGAKWDetoLoI7IdhmleiDBp6qezr2nbbUNIMFHeAmhWo3aGOjKhQb4EkLbB9J5g8JBozaA4q7KGvQpWooAriR6qM7I629CFSGMd3JDQYJPFdx72WbbSPARDktom6GlNqhDJSAolE/tPtdNsvFW59Apa6TTrJKaoWM1r7+JL6AoQIJPFdx72GbbSPAR1kWbOkZ6QW7Vk1rGjUSHRlDX71l0ae4XEnyq4N6vNttGgo/QF5ExVzq+Tb3Z29YhcTAqlAiArzckVzQ0ZlKrhuK136JUHGd67X0E1YpK+qReQwQICT5VcO9Tm20jwUfYEJEunF8/QX0R2dRPZSggiSC3+umGilbR6weJGb7vpfYuUx1rvaWAPxTaOyAJPlVw70+bbSPBR6iNzoxvutkFDyodNVuBehzcCXkNAMMRx3l+UTq5y/PvZObcq2/wAUKCTxXce9Jm20jwERolsuZUxpjKGrOrmBLZfPUkAwwmjtD83gWpAOQ1AFJxcKjaZxAk+FTBvf9sto0EH2EwJFFPiGrCWVdlZexAhVpn51b8qqGx+RVyLe5bSWrXHtLCKQEhv3m63oGbBL1oQEeMa63ZBPZ9Z7FtJPgIAydSuCHvA+ILwAYUts5SCQV+xwRnWz7zdt2/W9y/iv49qRx40oLbpn/gBoBiWU5dM5vAvdcGlw7YBAk+QlY6M25TytU2iB6ivxCew9dY6AgNyRdQiKgXkDeqR4nbdnA2kwNtAvf+GkiI6NoECT5Cu0jHc0gIcOk4TGm4cYB+t5GMOASxeoGg5fX+yfbUdgk+50D3dOz7aQAbrVXTDQk+QjvZdq3KKEPXUPT2YTk6IgVwvwkJSDtHZl09qN4B3VTzb2dfedjMoDUBPaTY1o1FIq3Fg2v599EAlnuPcZvkIqiOtxrHJ8FHqJ25lb9286+3B34/VO47rvTZ6lOprhKZcGjTgA1WD4oHXqv99+mIr7j7FTOD1gAER661gp5PtoDTDkOxku/nNslFQI8xneND8DnGbWRhBEkZX6gjglp0pe9EoJsE9yx+nxldTqtp5vUVw9b62w71ZkHBqo3gXCeVTDf38C8Aje3Y981A2zTYNFE3oJuocXynEHxauY0sjD6hOo0z46DuP8o9h319AZ1nvUeHpRM7at474euq3LXfzIB9AiKsnOvCpnbxtnUytS34aPUHqfjqUb2pMddzG1nYPMyteY7qbNYHsllUF1XSXFON+Op8TtW0jwJYPfByB1R48wUzg/UJZ/rXWdeDBJ/hGe3gk3hoVDo55pPcRhY2GekOJL+xg5IEzhjfMOXuQ0rHzs9z4sgQmWDeUVE6crX+Ltp32wIJPr+FBJ+RoXNsvanEZ0ZlU7H/xG1kYRNS1dncSRf2a8zvGjrq89svCHVN9aSQI2POU/ClhAxu4AUAqfKc60CCz/CMcvBB3JHgI7SClWyv4fugSjUTjnTXjGceUbCq1YpBFemiNooLZOvc8l+wzrkz7VYJPhJ8+A0tbHLSZX1+favhzDgKQNvm+Hrbh2OqR60A/91a2VPoF4T23Rwovr2iIZFWHbStpYdNwQcJOqwvJ0NA5/gk+AitI3riGJUVoTdt1Nz4eTYkL9RzBwQBUziRkf5mfu3z5sY6DJDhhsDHPdc2BR8kwXgpGA6K6l6QSzFkGEjwETYBEyoImQMFoD1LfT0b9No8HxXR0RZ08Eb8mwwV/vi69Hv8qJM2BR+88HgRjA2KfpXXTcFLLVs9lOAjtJ6FHfON9MbBcReUGPykYYPqjsojamWUoQC1kuvTPsbhwD2n55XSbVFIB3JrnmW3yUBCpsomQP1D5/hU8OlKjvkT+j96uI0tFA5HBKCSgdqg0qm3VD2Pn2eCjlwl0+Pth0gxAcoJNY/0eo5oH+Ng2KJfVm1tbk+ygQSfkZGZe5++8SXjuWxHy8dGuTNarkinYrO4jS0UjkRn8g2qk6lulI5t8XcENfErqtmeJ9AxHf67tf4mjuggkGoKxT1L1HNzzyWI2iubIMFnZOgMPqRusCadvOqDo1x31GX0f9zBbWyhsBZxPIUmcvVqr9VCJX3Kd1tuKEJ7Qimv1B1q/k3qMWQCkAtqpPmebtoUfHAEa5NtwCgHn3Qydpc7duy7RgF9yfgt3MYWCr0zoV0dodx1gIKJhxbZQ7CSPunpN3Cvk5n73Zp/D8/hp8fQSHVHKsWcfd6qhA1MfuHVi2oBsj3JBpmXHqhTWcM8dAYfxBsVeCT4CMNItBjWe2GNItSF/o7gKGnBq7PwKktfvQOqT1tu+Jbjs9nnayCzCx7UMi5dqLZG57fLeebXTzCSZOMbyNqcc6+28UnwEYaeuMQvbJ+nTRmh0n+q2pDOx7OgkZ5XQFrHa1IDAodfQGk7t/pp9nkaTEjz2wTrgs+GNm6TXATci0KNQtf4JPgIo0FSRnBeuF3bRsPRmK+vH/o3Ki3c4x1DPX83M+eeuu+5oJlXPUa05zjpPOtJUzcPqvmiRBZumwykbcFHvSz5LEkYihcFn3Qqfh39P7PcRhcK/RIipZ5Tnz3Ab1YYvja8oHRkoxIYrWuMFGRLx7epIz4lQ3RefoWOaHDvhP8/yD0XtWgTsGZ0OtaGSc+S3zSJ2ywXIb8+qTPTLUcvRNdfCD79qS/+UX8qtojd8EJhA8y+/APVSlvLhntjqq9nyK8b7+nvoz9/dsH3fY8VUjBwCkjhLmyfy94awStzrz2jZX50QQUfC+wyUEEDLxg2QWfwoQ+dzuzkxMcvBB8VgNri7dyGFwobZWbBA3V3IR0KOH7LrfiVr2fIdT7m6TeQMIFW49w2C5K26ZXZFnyQaGJVsgFBa/BJxtsvCjwSfIRRIr4KdADpzkh7rfsZSDXb0x0NFZ+qTqsW2CwQ0v2VbcHHti9GNDC0CdpFaCnOSPARRprIhKs4XQ1vPhwT+bm0V19gHvXauG0VFEvH3mx4PnSD2ya2Bx+V6VajN1VdHCr40EXQs/QflrmNLxTqIlJ6ddwB5ddNqP/36eLYa5q0F+WDsBPJEuUzbzc8F7rBbZfBzG+ezm2SiwBNRb1jjKUuCT50Fvff6T/s5ja+UKiTSi+t0Y6QdAbv67epmZyX4lNPrbdDTtW3iCSGbIKvlwrDNNvNt35oDj69lHDQcknwgdYO/YeHuY0vFOom5Psb3oRH3/D12976slCtyb6V7HYyR0oftkjL7TxqdZrloG3QHHyOkpD15ZcEn2rKtQQfYTSZXfzjxgRJ6d96VSYYTC/ab6gP0llFbhORtGEboA0IEVdu2wykM/Vr3Ga5GPTFjzR+jWM8PGTgkeAjjDKxsRvtDokLcz+p0ZDJ8QK0Tua2kwkWdr7UkN1NAPVYtqk/QObHJuC4ulYb+Do5fPCRvj7CKBNvuuVTuxvakL4CBCkZeLlIRjM5297GddBGVNtm89tmIHH3ZxN030WiwHTY4EPncb/DPQFCoVFSrUlDRahUp+JHjiX7ysOe/jwSJNhtpJHQsbMNpcMbSD7pOnbbNFvw6UnF/sOwwefc0Rv7JAiFJgkduIY2pc/sN6+p1/VqvtnKzOy7tDf+04HigdfYbTOY2UU/si4bEGUKOsc4YuCR4CNsFjbakttP1Te+frwUvuY3TmS3jw4iQ9A6kBir1op9XbairDLbkF3yiNYxegk+O7gnQig0TaRfF3e/4ntjlk/vVUkM9f6ul7bbkDTRWlXOwNyKf/Os8BAkVMsMyxINQBuDj+YxdtUMPrnUNX/OPRFCYRCEAGgl3+9za1b8KV/TkZoXoB8Pt30aYX5jh0+7mgV6CXHbZjBxz4dkE9ugdZyt8f+rZvA52xb7BPdkCIVBUd3D+FQRxmW6nwQBL+2/cd4OeSBu+/ihqqmyFNy2GYpQjbYNdTU89EDEFQk+QuEgNqL/VtyztP7fpEZ1Xts7O1PQjZTfRvWw9M5W3/Y0Cds6lp6njcEH3VR1jtFT8Olrj3+AlEcXc0+IUBgUVQ+VBlD3b6Luh5IKaoJ0vmyUgBmJViYZnENm7n3s9hlMVXvWfYjbNJcA6toax7mhf/zoD9cMPioAJRPf4J4UoTBI4vjMN6gvT72/h0wir+C2jWfSF13lfGtvC5GZcw+/jQavOwqINkJn8EE88RR4JPgIm5GoSfF9/OazKVxh2xxPfz4Mdz/OjNsaVo8wiaqcDr+dBhPdcm0DdO8ys+/WNsa6gk96wphr6R/1cE+MUBgkVfabz4p8CINCPaGe30NhoaeGd6hNWf4LdvsMR5W2vmeJL7sFgXLPYaWvx22noQhHbxsKb86gbrwtusbokKzOdZ6DD8nsXEH/aB73xAiFQRJOtHR8u68NC8me3Oqn6/5Nrw3WivtXs9tnOGbm3GudNMxAFA+uZbfRcLQRmpMNFvROaHm/5+ADUNLBJO6JEQoDZ9u1vht6FalQ0Jl2S92/WV/zM8sKJOlrz2agjqt/0vX8dhqCVtZC0REysu80ts2eVFfgAehT6Un6x9JWW9h0hPCkX6Cy32Rqcm7Vb9jtc54qS9DiBAOg3HWA3U7DsZK3UHSVvvz9KHcMQ8SP5+sOPtRr+6/oH3ZxT5BQyEG/KHcfrPu3IKXjFcgms+H+IrPwQbfc+45vOwWF7IIH2W01XIO9htu7G0Dp8Os6x9nd1zb6c3UHn3M6b8e4J0ko5GBu9VO+N3B+0+T6fg91P/RvvKLctZ/1KCkz69t0UX7at32Cgjpys2AtDcXi3mXqiMs2aA4+x3wFHoCO3vZxT5JQyEFV9+O3HQB6/tSZLaTqfujfeQW6srL0pPGozmADbCwqVWy/1kohUXxV++lVNQIP+g4+Tlvs0+wTJRQy0ZMKwTCXtqjhqev36OunsHNBXT9TOrrJzS79STD2oMSCzAI7j4qGAr4OnRduZ19DQ1F9VftMajEJzK3OcTrt8S/6Dj4A90QJhVzE3Ur57FFfG1nVllAKcj2/l335IW91P4O6TeY3TzNqB2farW7hrUWhOGpToC9IG9tknycKXm2EL53CEdhQ4DkXfBzuyRIKuVg6stHfTiYHmN+Qqvv38Mbu57fQm8iZerP28aNtRLn3mD8bMAHZg86Um9jXzlDMzPpW3S8YQUF3D6mGg09f6+i/4J4woZCT9dzFDATSfOFs6vu9REMOBOnPyok00IobStq4g6r0nWjoWVhA93S5lb9mXzPDEV/TVoLspnOciBsSfITCBgl1Ab/IrXqy7t9rpM4IQJYXjp1yy37urd8QJUfgPgf/fbDis7+RDbBZCcJm1W/0tdI5Tj3BZ9zVf0h/bAH3pAmFnPSLSvpU3b/lTL5Rm1NBLU5h18IRibP+Svqktt/kRL36emFZR6bhpyniCFyW7oh/qOHg47qjLksnY3dxT5pQyMncyid8b+zcmufq+z3U/ZCUjqA+2Cy+CnrpYMuB8uk9WjMD06nE3e7Yse9qOPgAdA59M/3RAvfkCYVcxJuh7zRjSqutW/F68Vh1fCbwBgi7ZuZ+l32dDEeHioIruT5uMw0JaMxpHGvBScVv1RJ4AHxCSXdTYbMTmV++QHcofpSCIfBoc3M2a0CX5fm1z7Ovj5GIbEQbFQ0QEP3oEY7AldkJiY9rCz4A/dGp3BMoFHISBZ1+02Rx5FJvKjTShf3WGTUT0Jai/qzC4Ih5L72zhdtMQ6J0fJtupYypWgMP4CTjsXQynuaeSKGQjZQV5rffD47e/LydOzO+qdXZRA70ZYgiWPa1MQKhRG6jogGA7Dtd43Ta4hmSZLtDe/AB6AdOcE+kUMjJwvZ5vjd68e3lKpOt3t+0tSjRBqAAlntNjEjScatHNDZQ4C5S73hPGAk8AF0kzWSfTKGQmY2c3Wdf/kHdv4fLalszpTgBbTvutVCLmRe/w22mYYEjXb3jjS0yF3xaR/8x92QKhdxUxyg+AekXX7+54lf6vE5EgJ443GuhFm1Urz4P9GTSOda+9vh/NhZ8AO7JFAptYCOot92CIl0KF99eocfrRACFrbP82TFE68Q0dI/VaOABnI7Rf8s9oUIhNwtvzvC96X1L11PxKdSymx06L8lNspLp4TbVsND91eOkRn/JePBJJ8d8kntShUJu4u7GN+iiN7v4x75+N//GFG0OKJRAzdT6Vvb5r7k+Fv1QtbuwEZVcWgnQ6hwv4oLx4NM9ruUKulhKcU+uUMhJ1G4UD6717QAaaVcM0dBmBe6+uOe+JknNAp1mbUXxrcUqiUXfmGMpxAXjwQcg7Z5vsU+wUMhMNHHzDfr6qVvz7TyV9pudDclMIrv0p+xz7oVo6WBrXQ+Q3zRJ63gRDwIJPCr4TIj/Jf3oRu5JFgo56Uy7RVXX+4Vqte1ThTkz5x767X36PJLlKHcfIhWDb7PPec01Mf3rqo+TrSgde1P3mHf3Jcd8NrDgA1DNzwzuiRYKuelb8eAcMvPu9/3buc7HmkJ8tNJ/xs2+8jD7XHuh1XdyVJ8GfUKd40UcCDTwAJnW2GdJSqGPe7KFQk5mX36oIX9QOralsd8npxxpUIJBduG/ss+zV+J5rQV15O3XeNcD/9/XNvpzgQcfgJSuT3NPtlDIzUbR6O/jCC6qgLgq9/x6JY4GbYYSEdU5ZvL/LIEHoMh3G/eEC4XcRM1EI0BKbqPPkF3yiEqhjQpQI5OZex/73NbzAmBrv57z0D/u2KNswQfgnnShkJ1tica8Aup+qF1Do8+BNORK3s7aknqg7nh81kFxMDP7buoGupfbbCOieOA17eNmDTzV4BO7h3vyhUJuNnrRXDq8QQWxRp8DHVBDDboUzy74Pvt81sPc6qfw4NyWGxHZBXoVDeD3uWMPBZ8xn+KefKGQm6hobwh0GayrGyfexMMKvcWP5unMvIPeHPLcZhsRhS0zVW2Y3rGP+RR37Bnljvv0e5xk7Afci0Ao5GSjigdAcV+nr34/QxFfQKoGiVpMhwHoWaRb8iUI2t5rqVLI0JfZ03rHnYz94shjLb/LHXsUKPHgOuJZ7oUgFHKyEbHR88ARjrZnoq8Iq+tOzqGSPqWCJff81cvcmme5TVcTflt4DEcnlejvT8Zv4o45F+DOaHl/f1tsCfdiEAo5iQr8RlWncdmu+7lU/yE61rMRudeecTPzv8c+d74CD7Xwthp0f5bx0bywBpf1jx/9Ye6YcxEo53s69fCucC8KoZCTpRM7G/YZ5dN7ND8XJTJ0fJmO9VY27tA0oqpa0HiSBQfREt16UPDRPW50s+aONUOCHq6be1EIhZzMdT6u5ZzelI4ZjuHKXfsbd2wNAHdjmbnfZZ8rXyQtvsKbL7DazyucSTfoHn83d4wZFqRu+hD74hAKmakDcNCmns+ZcqPKgAq6Ir+4f1U188qCOfLLhrMaA0Jx/2rtY4d/544xI4J7cQiF3ITaQKOoZM+62VcfNfqcqMrPLvpR456uBso9R9TvIOhxz02jLJ89atxeOoAgqXvs3LGlJpxk4m+4F4hQyMr2a7U4ELy9BqJtRjUgCAylIxu1PPcFUJp3/8TrDNSY8LDcd1yvfQwBWZe679KcttinuWNLTeQmtvwZpV3v414oQiEbydkicOgAMtWCfn5kn5VO7Kjy5K7amnEUZJDld/7fFHa9zD8HGom7k+KBNVrm0zQgr5Rb9aTW8cOfw69zxxZPoDzw+7gXjFDISW0yNwYylupie4tKokDX1mG5oY1UFe5it7mxuSTdPdtFQ88D/aV0jz/TFr+PO6Z4RmZ84qMULVdzLxqhkIs4xtKV2qx03ywYUzMSyhVhuecBdGcRUmr16mzH1R/jjil1gTIjXuReOEIhJ5HZpQXUoKywfS77eJqOjaqVBw0DX8nw49yxxBfo4XvZF5BQyER04Kz0n9LiV3CX4kz/BvuYmoU4RrRdt20gUBumQxV9EHvdsWPfxR1HfIHufu7nXkRCISdLp97S5mBQJxOFdGXb6cy4jdqbv2l9m4SBqNZPaQ4+5L+5Y0hD4F5IQiEntba4pqZzUb7Yt4KUqQgVaNg6LCgeWuc6027Rbgvu2NEwkB/OvqCEQkbqbmsAiRfuMUWVqj9PmED3PMg41G6HMNT11ALyw2kwu7gXlVDIRSgLa/U3me5q8aYFY4sScUcXNkDI1oAtdoWmrqcWnGT8mzQgh3txCYUspC+Vik75feqcqavrqbDK3LKf1y6mtRC5zsd026KQTsbu4o4Z2tA7gfr9pOLLuReYUMhCykLKrR2n1enAUWaX/Yx/bBFgdvGPSUuvV+v8BIH8psnabUH1mZ3pZMsHuWOGVqTbv/SXNLgs90ITCjmoBDw13/1UqP4ntK0JLKEz806tcxIY6EsaGoJa7ZGM59Kto/8bd6wwAjSc415sQiEXC1tna/dBaIsACRzusYWRYWmPcAkoycBE23FSM5jBHSOMgXL3LuNecEIhF7OUeFDpP63dFxW2zWEfW9iYW/6L0Oi1DUbp6BtUi/RN7TaZ0TLqcu4YYRRUCHU998ITCnmYoBbZe/V7o3KJvqpmWTC+cBBfDWENPPjSNRF44Je5Y4Nx5FLX/DkNdgf3AhQKOZiZc68xx5Rf3xqZ3jlGSOnputPegwa+egzY5mi67Zr/gzs2BIK+1niMBnyCfTEKhQwsdx0w5pzy68azj89GZubep9TBw4zS0U0mbHOKMtwS3DEhMECsjpIPFnMvSKGQg5n5/2zUSVV1vvjHaQsReMrdB43aPAgY6mq71B1323u4Y0KgyCTH/AllV+S4F6ZQGDip6LQqXGkIcgd0gehCWuk/Y87WASH32jM0Hs2tscn/wg9zxwIWoEMe9+IUCjmYfeVh7XU/g9HUd0ATv0Jim7catW9QKGyfZ2QeKfg8yx0DWCHHb8JmpDP9627pyEbjjiu/fgL7WIO37Teo/cRq9QUYdiArL7fiV/rtRH6X2/ezozc55r+QMQrcC1YoDJo4SqkUHOMOrKmO4Dq+bPZIM2BkX33UhJ3KvanEZ7h9PzvchVe9l6LwL9kXrVAYNCn112Tm2wXQFwC+sjIvfod/zAZZ3LPErfSdMG/PgFA8tN6MrcjfHkhd+T5u328F3LGjKPsttoR78QqFQTO75JHAnJnSgnvpAfYx62XCdaZ+zS3ufiUwOwYBCJ0aapux1B175bu5fb5VoGiMlttl/sUsFAZL1G8ECcjwm6mSD57oOlru2h+o/Uyj3HNYpYcbsFcZfpbb11sJUlW9iXsxC4VB05lxW7DejVpEl97ZGuqvoMy8+93CzgXB2i0IUAZktVWC3rTqc9ltt3L7eKtBRpLkA2FzEf1+1jwXuJ9DJhWUttnHXyeVQCv679AxYtSAYtj+SdcbsZvrjrqM279bDfQOJ0N1cS9woTBIot9PJd/P4vBwSZ+Z9S0qyDTj9LSQ2kbgC7FSyLDYKAhgHgzZrwt+ldu3hwL9qdg9aGzEvuCFwgCJYkJO4NIedyjcdhhM1O3kN09zK5keVvuYRPnMPlMJBgXypXLP4xXZyYmP9ydjb3AveqEwSGbm/ZNbSZ9idoMVKtBc5eZWPcluD9x74FlKx7cx28Q8cqt+Y+Seh7g51xb7BLdPDxV6J7S8nwwn2W/CpmJ+fZLbD1ZBbZrxpWGkur4GnclfdQu7Xo70l85A4IsTen8GbFmGH+X25aHEmfYvfYTbGQiFQbPce4zbH16C4r5ONzP7bkVn8o16x0yqBJlZ31Z/2y3luYcaKIqH1hlcS7G/4vbhoUY6lXiR2xkIhUES0vk2o3jgNTe/9nnFXOfjKnjUO0aoLUBeCH8DbcAr9KXVbCjufdXYGoLf5PbdoUc62fJBKoyazu0QhMLASJldcMhhQKWYpSZtr1NAWlMXy2fejoTwp18UD65VyttG1g/5S/hNbt8dCfS1jv4LMug2dqcgFAZEtAMIe+dNwdCoZM+62cVjTa2dPb2pq/+O22dHCmTUVm6HIBQGyfzGiU13BxJ50HxiXg2um1ZuXx1JkGGf4HYIQmGQjKSETBMjv7HD5Hp5gttHRxbuqFGXpZPxR7gdglAYFKHYLIgGVHKGsbUSe1zkcwzD6Rj9t2Tso9xOQSgMis4Lt3P7TUGDyK38Nc2lkSJSsLdvQuJz3L65KUDqrHfQF1Ca2ykIhUExt/yXkRTSjDzUHY+5ozb4QfhDbp/cVCChvDu5HYJQGBRRhFk6uYvblQrqRH5Dyui6gB/k9sVNifSEMddyOwWhMCiiMLPSf5rbnwo8Ak37zK6JMV/l9sFNC3dGy+VU/zOJ2ykIhYGRClAF9iO38gnTa2GZtMNmhpNK/J3TFj/C7hSEwoCo1K+bUI4mFMAdz+vtRucf/g5+j9v3Cgg0IZ8nSgacsDlIWmqFtxZxu1nBEIAqueH5h5/7PLfPFQyA03oNUrD5HYNQGACdabcoTTWBHSh3H3Kzrz5qft7Jz3H7WsEQcMdd/XvcTkEoDI4JK9svNBuK+1e7/QG0ID/R8YXf5/axghGQTsWvpIk6ye8YhMJgWDr1Frf/bVoU960MYo67eltjV0Hhhdu/CkYAZcD9bjoVe5gu5TLcTkEoDIIOvXWjTYEgWBS2zw1ifgtOKvZU16Sr/oDbtwo8oH/86A/TpG3kdgpCYVB0pt4sd0ABAcW+2aU/MdX6ejB3ZNpbPsLtUwV1gmqAitxOQSgMknIHZBblvuPBzSf5L24fKvAJN3Xz+2gSN3M7BKEwSJaOb6fX8wK3n44Uyj1H3NKxN4Ocx83wX9w+VNAAchNH/xlN5EpuhyAUBkZqz4yGZeWzR7l9diRQ7tqvCnsNqlIP5kr4LW7fKdCAngmJj9OE7mJ3CkJhUGy/1s3MvsutZLq5fXeogR48zsw7g5y7XfBX3D5ToBmSASdsRlaP4Crcfjw8QOsKkslxZt4R6DzBP3H7SIEhvENFqE5b4nVuZyAUBklnyk1Uj9LpVpwubrduPWAjpc3WFtgR27nAk3gd/onbRwoMoneCugPq5HYIQmGwTLjZJY+4lXw/t3+3FoWts5WNGOanE36J2zcKAkBmUuKjNOG7+R2CUBgsM3PuVXL/gt8CWWyZefcHVbczmLvhj7h9oiBg0MT3cjsDoZCDuZW/pq8gh86ZmvQuiO50MP4AM9iGYi+3DxQw4dTTLf+OFsB6bkcgFHKxuGdptS6oWVAuuqVD693sKw9z2349/A+3DxQwItcW+wQtBLkDEjYt0Z4hv2ly5NURCltnubnXnmG3N7ETfofb9wksgNM6+o9pQeyxYFEKhTykuiCkFuOLIFKgjq+5ZT9Xd11MdzqDuQf+htvnCSwDLYwzxLIFC1QoZGVu1ZNuJdsbwnbdlepzp09Rke3d7HYcQPiVM9w+TmAp0KwpnYwnaZGcsGCxCoXszC3/JbVreM0tn9pN9yUl7sgyNOgep3x6j3rO4t5l7Da7hG3x08RJbseN0gxOMDxOt47+95m2xDW0aCQACYXnmJn1bTe3+mk3t+Y5t3T0De5wo1DY9bJ6ntzqp9TzcdtoGFJjyzFfpT5jV3D7NkEI4LqjLjvbcfWfWrBwhULr6Ez9mtKNAwtvvhBYsCl3HbjwuyAEVLltUYtILKDAczm3TxOEDOlkywdpAXVzL2ChMCyE+jNStyFT0whLJ3a62cU/Zh9PA+yG/+D2YYIQo681/ve0kCQTTigUeuUe+A1u3yWIAPraEp+jBbXMgkUtFArt5nr4C26fJYgQ+sZd/Ye0sD5vweIWCoUWMp2Kt6Q74h/i9lWCiKIvFYtROnaae6ELhUI7CH8Av8DtmwRNgL5k/BZadD3ci14oFLKzB/6A2ycJmgjU/Gl0fzL2CwsWv1AoZKCTij0FP/C/2jub0DjKMI6nfmD8OChWBJUWRTzpIQoWKmKwoVR0szMT9qIXEVEPiuAlKAqhFMSLih/V0M3MboSKFwW9KAqSIEJh8dAi0ngoag82bZLN7M5uqLTr86SbWoO2m+5unnd3fj/40ZJTdub5P7OZeed5rXsRpJBj0fBgLfJetg4BIm6umnt2HgVzakX/TSnIeetAIGLXXdC8W/ccgPNUw+yIzG866EA4ELEbSr6TYsDCAnAPHRyYRP5H5iFBxI6quWYwKDjNH2/nrtWHkLLmv2wdGERs2+V6wX9Kc23dWwBaRgpXx/KcdSBAiLgxNbdz1j0E4LJoTkV4VzzqQJgQsTXn5M7F+5pf6x4C0BbLYXaHFPSCA6FCxIsrq9m8BxsDA1us+wZAR9DNpKpT3m4HwoWI/6FMovbY9A36luYuqYdl2eZf1mFDTL2aw4J/RHNp3RsAuo5ORqhE3l7z4CGmXBmRs3f+w9wN1j0BYFOJo2xGlmXvtw4gYtqUBQUfM5cNUk1j8rmrJQxT4hnrQCKmwLNym+0zzZ119gGcQYJREk84EFDEflNnL5asMw7gJL++99g1uuJGQsJ7QYid86juMtqInh60zjiA0yT5sSEJzB4HQovY6+7RPFlnGqCn0FU4MtBwnwMBRuwxvXcWJ3lnB6AtqlHwpNw2mLEPNKLzzsgXtmesMwvQV6y+G1TwvnUg4IhuKbnQd3asMwrQt9SnM9sqof+oBK5uHnhEe+uaB82FdTYBUkGjMbClNuXtdCD8iDYWvF2aA+ssAqSSxmTmOn24KmE8ZN4MELtt6P2k2x2U9z9+k3X2AEBohLlb5PbDPnnY+qN5g0DsvCWt76V8sN06awCwjsbExBUrYXBXOfRHqoWAqdnYD56J89nMyie5u2W7gyutMwYALRAXgockvKdFtvLGXlLr9bTWr3WGAKANZK+St2SY4jdchNB5pU61Xq0zAwAdRMI9LvfNQ3lgWzZvMohNpR5jqcui/H/cOiMA0CWWIu/GpDg2VJkafcS66SBWw+xIOfKHWL0GkDJkddxrslS7Wg39FfNGhP3vuTpLktB73br2AcABkoL3QFLwv5LGoNs58GwIO+2c1tdymN1hXesA4CBxmN0p305fqUTBGw40LOxxdd6a1lOcZ+UaALRAY2L4Kt0HpRJmn5cmwu6quBHnK6H3otYP21UDQFsci4YH5fnQD9JYlkR9d8i6waErnnuhWeuixG6hANA1ZGuHV+X+/efSbGZFpmunUPkiogsHZrUOdNGKdU0CQIpIpkZv04275PnQS80LkXlTxK57SM93HAbP1oq5261rEABSzkm5EFXy/r3NvYZ+d6BJYscMftN5gXp+ueAAgPM09xs6LJ6QsSkn7ZsotuCp5gKTn+Mo+7B1DQEAtMXxD3bdLA3tU1Vu23zhQJPFf/xy7dxUD4zeal0rAABdQVfOyTyvF9bUb9kONOA0+cuFx//P6d3XW9cEAMCmo88R4qJ/z6qR50lz1Fs/1g26n1yQSdFja8e4diC4w/qcAwA4zWKUvU+apz43Or6mTkF2oKE7Y/N4nD8+MlHgyFJ+dMj63AEA9BVJ6MtfR8H0v/W/7/eLkqwkrMhnnFn/2eVngfU5AQBIJYvTmW2rt5bkvaMLlaY9rhcm6wvHBp3VFzfXfxa5yOTq+WC79bEGAIBLUJLZYvFkZmt5OnPn/5mET9zf3Fria2n8y936q0X+/U4Htp6Syc4X+33ig5mtzESDfudvVfSJvtAOQloAAAAASUVORK5CYII=";

const View = () => {
  const router = useRouter();

  const [userData, setUserData] = useState<DataType>();
  const [people, setPeople] = useState<DocumentData[]>();
  const [files, setFiles] = useState<string[]>([]);

  const [user, setUser] = useState<User | undefined>();
  const [activeFile, setActiveFile] = useState<{
    name?: string;
    number?: number;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [showOption, setShowOption] = useState(false);
  const [showAddPerson, setShowAddPerson] = useState(false);

  useEffect(() => {
    // ログイン状態確認
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // ユーザー情報をセット
        setUser(user);

        setUserData((prevState) => ({ ...prevState, user: user }));
      } else {
        // ログインしていない場合はトップページヘ
        router.push("/");
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    checkUserInfo(); // ユーザー情報を取得

    // peopleコレクション常にチェック
    const peopleCollection = collection(db, "usersData", user.uid, "people");
    const q = query(peopleCollection, orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (people) => {
      let peopleArray: DocumentData[] = [];
      people.forEach((doc: DocumentData) => {
        let currentDoc = doc.data();
        currentDoc.id = doc.id;
        peopleArray.push(currentDoc);
      });
      setPeople(peopleArray);
    });
  }, [user]);

  const checkUserInfo = async () => {
    if (!user) return;

    const docRef = doc(db, "usersData", user.uid);
    const docSnap = await getDoc(doc(docRef, "data", "info"));

    // usersDataコレクションに存在確認
    if (docSnap.exists()) {
      // ユーザー情報取得
      await getUserInfo();
    } else {
      // ユーザー情報無かったらセット
      await setUserInfo();
    }

    setIsLoading(false);
  };

  //  ユーザー情報取得
  const getUserInfo = async () => {
    if (!user) return;
    const docRef = doc(db, "usersData", user.uid);

    const settingDoc = await getDoc(doc(docRef, "data", "setting"));
    const infoDoc = await getDoc(doc(docRef, "data", "info"));

    setUserData((prevState) => ({
      ...prevState,
      userData: { setting: settingDoc.data(), info: infoDoc.data() },
    }));
  };

  // ユーザー情報無かったらセット
  const setUserInfo = async () => {
    if (!user) return;
    const docRef = doc(db, "usersData", user.uid);

    await setDoc(doc(docRef, "data", "info"), {
      email: user.email,
      name: user.displayName,
      createdAt: new Date(),
    });
    await setDoc(doc(docRef, "data", "setting"), {
      colorTheme: "white",
      viewType: "panel",
      template: [
        { label: "name", type: "string" },
        { label: "email", type: "string" },
        { label: "phone", type: "number" },
        { label: "age", type: "number" },
      ],
    });
  };

  // files
  useEffect(() => {
    const fileArray: string[] = [];
    people?.forEach((parson) => {
      const currentFile = parson.file;

      if (fileArray.length === 0) {
        fileArray[0] = currentFile;
      } else {
        let alreadyFlag = false;
        fileArray.forEach((file) => {
          if (file === currentFile) alreadyFlag = true;
        });
        if (!alreadyFlag) fileArray.push(currentFile);
      }
    });
    setFiles(fileArray);
  }, [people]);

  const changeActiveFile = (fileName: string, fileNumber: number) => {
    setActiveFile({ name: fileName, number: fileNumber });
  };

  const changeShowOption = (state: boolean) => {
    setShowOption(state);
  };
  const changeShowAddPerson = (state: boolean) => {
    setShowAddPerson(state);
  };

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>HitokanApp</title>
      </Head>
      <Header changeShowOption={changeShowOption} />
      {isLoading ? <Loading text="ユーザー情報を取得中です" /> : ""}

      {showOption ? <Cover show="option" changeShow={changeShowOption} /> : ""}
      {showAddPerson ? (
        <Cover show="addPerson" changeShow={changeShowAddPerson} />
      ) : (
        ""
      )}

      <AddButton changeShow={changeShowAddPerson} />

      <div className={styles.viewWrap}>
        <FileView
          files={files}
          changeActiveFile={changeActiveFile}
          activeFile={activeFile}
        />
        <PeopleView people={people} activeFile={activeFile?.name} />
      </div>
    </div>
  );
};

export default View;
